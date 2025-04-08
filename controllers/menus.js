const Menu = require('../models/menus');

exports.getAllMenus = async (req, res) => {
    try {
        const menus = await Menu.find();
        res.status(200).json({
            success: true,
            data: menus
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.getMenuById = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);
        if (!menu) {
            return res.status(404).json({ 
                success: false,
                message: 'Menu không tồn tại' 
            });
        }
        res.status(200).json({
            success: true,
            data: menu
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.createMenu = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newMenu = new Menu({
            name,
            description
        });
        await newMenu.save();
        res.status(201).json({
            success: true,
            data: newMenu
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.updateMenu = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        const menu = await Menu.findById(req.params.id);
        
        if (!menu) {
            return res.status(404).json({ 
                success: false,
                message: 'Menu không tồn tại' 
            });
        }

        menu.name = name || menu.name;
        menu.description = description || menu.description;
        menu.status = status !== undefined ? status : menu.status;

        await menu.save();
        res.status(200).json({
            success: true,
            data: menu
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);
        if (!menu) {
            return res.status(404).json({ 
                success: false,
                message: 'Menu không tồn tại' 
            });
        }
        await menu.deleteOne();
        res.status(200).json({ 
            success: true,
            message: 'Xóa menu thành công' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};