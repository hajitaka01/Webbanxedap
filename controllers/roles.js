const Role = require('../models/role');

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json({
            success: true,
            data: roles
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ 
                success: false,
                message: 'Vai trò không tồn tại' 
            });
        }
        res.status(200).json({
            success: true,
            data: role
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.createRole = async (req, res) => {
    try {
        const { roleName, permissions } = req.body;

        // Kiểm tra role đã tồn tại
        const existingRole = await Role.findOne({ roleName });
        if (existingRole) {
            return res.status(400).json({ 
                success: false,
                message: 'Vai trò đã tồn tại' 
            });
        }

        const newRole = new Role({
            roleName,
            permissions
        });

        await newRole.save();
        res.status(201).json({
            success: true,
            data: newRole
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { roleName, permissions } = req.body;
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({ 
                success: false,
                message: 'Vai trò không tồn tại' 
            });
        }

        // Kiểm tra nếu roleName mới đã tồn tại (trừ role hiện tại)
        if (roleName && roleName !== role.roleName) {
            const existingRole = await Role.findOne({ roleName });
            if (existingRole) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Tên vai trò đã tồn tại' 
                });
            }
        }

        role.roleName = roleName || role.roleName;
        role.permissions = permissions || role.permissions;

        await role.save();
        res.status(200).json({
            success: true,
            data: role
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ 
                success: false,
                message: 'Vai trò không tồn tại' 
            });
        }

        await role.deleteOne();
        res.status(200).json({ 
            success: true,
            message: 'Xóa vai trò thành công' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};