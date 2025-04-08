const jwt = require('jsonwebtoken');
const constants = require('./constants');
const User = require('../models/user');

module.exports = {
    // Kiểm tra đăng nhập
    check_authentication: async (req, res, next) => {
        try {
            let token;
            // Kiểm tra token từ header hoặc cookie
            if (req.headers.authorization) {
                const authHeader = req.headers.authorization;
                if (authHeader.startsWith("Bearer ")) {
                    token = authHeader.split(" ")[1];
                }
            } else if (req.cookies.token) {
                token = req.cookies.token;
            }

            if (!token) {
                return res.status(401).json({ 
                    success: false, 
                    message: "Bạn chưa đăng nhập" 
                });
            }

            try {
                // Xác thực token
                const decoded = jwt.verify(token, constants.SECRET_KEY);
                
                // Kiểm tra thời gian hết hạn của token
                if (decoded.exp * 1000 < Date.now()) {
                    return res.status(401).json({ 
                        success: false, 
                        message: "Token đã hết hạn" 
                    });
                }

                // Lấy thông tin user và role
                const user = await User.findById(decoded.userId).populate('role');
                
                if (!user) {
                    return res.status(401).json({ 
                        success: false, 
                        message: "Người dùng không tồn tại" 
                    });
                }

                // Lưu thông tin user vào request
                req.user = user;
                next();
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({ 
                        success: false, 
                        message: "Token đã hết hạn" 
                    });
                }
                return res.status(403).json({ 
                    success: false, 
                    message: "Token không hợp lệ" 
                });
            }
        } catch (error) {
            console.error('Lỗi xác thực:', error);
            return res.status(500).json({ 
                success: false, 
                message: "Lỗi server" 
            });
        }
    },

    // Kiểm tra quyền truy cập
    check_authorization: (requiredPermissions) => {
        return (req, res, next) => {
            try {
                if (!req.user || !req.user.role) {
                    return res.status(403).json({ 
                        success: false, 
                        message: "Không có quyền truy cập" 
                    });
                }

                const role = req.user.role.roleName;
                
                // Định nghĩa quyền cho từng vai trò
                const rolePermissions = {
                    admin: ['CRUD', 'VIEW', 'CRUD_SERVICES', 'CRUD_ORDERS', 'CRUD_REVIEWS'], 
                    user: ['VIEW', 'CRUD_ORDERS', 'CRUD_REVIEWS'], 
                    technician: ['VIEW', 'CRUD_SERVICES']
                };

                // Admin có toàn quyền
                if (role === 'admin') {
                    return next();
                }

                // Kiểm tra quyền
                const hasPermission = requiredPermissions.some(permission => 
                    rolePermissions[role]?.includes(permission)
                );

                if (hasPermission) {
                    next();
                } else {
                    return res.status(403).json({ 
                        success: false, 
                        message: `Vai trò ${role} không có quyền thực hiện hành động này`,
                        userRole: role,
                        requiredPermissions: requiredPermissions
                    });
                }
            } catch (error) {
                console.error('Lỗi kiểm tra quyền:', error);
                return res.status(500).json({ 
                    success: false, 
                    message: "Lỗi server" 
                });
            }
        };
    }
};