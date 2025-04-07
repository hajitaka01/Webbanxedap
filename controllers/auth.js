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
                return res.status(400).json({ message: 'Username đã tồn tại' });
            }

            // Kiểm tra email đã tồn tại chưa
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email đã tồn tại' });
            }

            // Tìm hoặc tạo role user
            let userRole = await Role.findOne({ roleName: 'user' });
            if (!userRole) {
                userRole = await Role.create({
                    roleName: 'user',
                    permissions: ['read', 'create_order', 'create_review'],
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
            res.status(500).json({ message: 'Lỗi server' });
        }
    },

    // Đăng nhập
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Tìm user theo username
            const user = await User.findOne({ username }).populate('role');
            if (!user) {
                return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng' });
            }

            // Kiểm tra mật khẩu
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Username hoặc mật khẩu không đúng' });
            }

            // Tạo token
            const token = jwt.sign(
                { 
                    userId: user._id,
                    username: user.username,
                    role: user.role.roleName
                },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            // Cập nhật thông tin đăng nhập
            user.loginCount += 1;
            user.lastLogin = new Date();
            await user.save();

            res.json({
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
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
};

module.exports = authController; 