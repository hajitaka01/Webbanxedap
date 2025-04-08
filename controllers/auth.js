const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../Utils/constants');

const authController = {
    // Đăng ký tài khoản mới
    register: async (req, res) => {
        try {
            const { username, password, email, fullName, phone, address } = req.body;

            // Kiểm tra username đã tồn tại chưa
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Username đã tồn tại' 
                });
            }

            // Kiểm tra email đã tồn tại chưa
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Email đã tồn tại' 
                });
            }

            // Tìm hoặc tạo role user
            let userRole = await Role.findOne({ roleName: 'user' });
            if (!userRole) {
                userRole = await Role.create({
                    roleName: 'user',
                    permissions: ['VIEW', 'CRUD_ORDERS', 'CRUD_REVIEWS'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo user mới
            const newUser = await User.create({
                username,
                password: hashedPassword,
                email,
                fullName,
                phone,
                address,
                role: userRole._id,
                loginCount: 0,
                lastLogin: null,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            res.status(201).json({
                success: true,
                message: 'Đăng ký thành công',
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    fullName: newUser.fullName,
                    role: userRole.roleName
                }
            });
        } catch (error) {
            console.error('Lỗi đăng ký:', error);
            res.status(500).json({ 
                success: false,
                message: 'Lỗi server' 
            });
        }
    },

    // Đăng nhập
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
    
            // Tìm user theo username
            const user = await User.findOne({ username }).populate('role');
            if (!user) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Username hoặc mật khẩu không đúng' 
                });
            }
    
            // Kiểm tra mật khẩu
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Username hoặc mật khẩu không đúng' 
                });
            }
    
            // Tạo token với thời gian hết hạn
            const token = jwt.sign(
                { 
                    userId: user._id, 
                    username: user.username, 
                    role: user.role.roleName,
                    iat: Math.floor(Date.now() / 1000), // Thời gian tạo token
                    exp: Math.floor(Date.now() / 1000) + (60 * 60) // Hết hạn sau 1 giờ
                },
                SECRET_KEY
            );
    
            // Cập nhật thông tin đăng nhập
            user.loginCount += 1;
            user.lastLogin = new Date();
            await user.save();

            // Đặt token vào cookie
            res.cookie('token', token, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000, // 1 giờ
                sameSite: 'strict' // Tăng tính bảo mật
            });
    
            res.json({
                success: true,
                message: 'Đăng nhập thành công',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role.roleName
                }
            });
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            res.status(500).json({ 
                success: false,
                message: 'Lỗi server' 
            });
        }
    },

    // Đăng xuất
    logout: async (req, res) => {
        try {
            // Xóa cookie token
            res.clearCookie('token');
            res.json({
                success: true,
                message: 'Đăng xuất thành công'
            });
        } catch (error) {
            console.error('Lỗi đăng xuất:', error);
            res.status(500).json({ 
                success: false,
                message: 'Lỗi server' 
            });
        }
    }
};

module.exports = authController;