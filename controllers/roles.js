const Role = require('../models/roles');

const roleController = {
    // Tạo role mới
    createRole: async (req, res) => {
        try {
            const { roleName, permissions } = req.body;

            // Kiểm tra role đã tồn tại
            const existingRole = await Role.findOne({ roleName });
            if (existingRole) {
                return res.status(400).json({ message: 'Role đã tồn tại' });
            }

            const newRole = new Role({
                roleName,
                permissions
            });

            await newRole.save();
            res.status(201).json(newRole);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy danh sách roles
    getAllRoles: async (req, res) => {
        try {
            const roles = await Role.find();
            res.json(roles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy role theo ID
    getRoleById: async (req, res) => {
        try {
            const role = await Role.findById(req.params.id);
            if (!role) {
                return res.status(404).json({ message: 'Role không tồn tại' });
            }
            res.json(role);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Cập nhật role
    updateRole: async (req, res) => {
        try {
            const { roleName, permissions } = req.body;
            const role = await Role.findById(req.params.id);

            if (!role) {
                return res.status(404).json({ message: 'Role không tồn tại' });
            }

            // Kiểm tra nếu roleName mới đã tồn tại (trừ role hiện tại)
            if (roleName !== role.roleName) {
                const existingRole = await Role.findOne({ roleName });
                if (existingRole) {
                    return res.status(400).json({ message: 'Role name đã tồn tại' });
                }
            }

            role.roleName = roleName || role.roleName;
            role.permissions = permissions || role.permissions;

            await role.save();
            res.json(role);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Xóa role
    deleteRole: async (req, res) => {
        try {
            const role = await Role.findById(req.params.id);
            if (!role) {
                return res.status(404).json({ message: 'Role không tồn tại' });
            }

            await role.remove();
            res.json({ message: 'Xóa role thành công' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = roleController; 