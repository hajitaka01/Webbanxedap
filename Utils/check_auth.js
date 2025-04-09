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

                // Lấy thông tin user và role (populate để lấy cả permissions)
                const user = await User.findById(decoded.userId).populate('role');
                
                if (!user) {
                    return res.status(401).json({ 
                        success: false, 
                        message: "Người dùng không tồn tại" 
                    });
                }

                req.user = user; // Đưa user vào request
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

    // Kiểm tra quyền truy cập động từ database
    check_authorization: (requiredPermissions) => {
        return (req, res, next) => {
            try {
                const user = req.user;

                if (!user || !user.role || !user.role.permissions) {
                    return res.status(403).json({ 
                        success: false, 
                        message: "Không có quyền truy cập" 
                    });
                }

                const roleName = user.role.roleName;
                const userPermissions = user.role.permissions;

                // Nếu là admin, cho phép tất cả hành động
                if (roleName === 'admin') {
                    return next();
                }

                // Kiểm tra user có đủ mọi quyền được yêu cầu không
                const hasPermission = requiredPermissions.every(permission =>
                    userPermissions.includes(permission)
                );

                if (hasPermission) {
                    return next();
                } else {
                    return res.status(403).json({ 
                        success: false, 
                        message: `Vai trò ${roleName} không có quyền thực hiện hành động này`,
                        requiredPermissions,
                        userPermissions
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
