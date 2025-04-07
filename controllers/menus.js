const Menu = require('../models/menus');

const menuController = {
    // Create
    createMenu: async (req, res) => {
        try {
            const { name, description } = req.body;  // Sửa menuName thành name
            const newMenu = new Menu({
                name,
                description
            });
            await newMenu.save();
            res.status(201).json(newMenu);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Read - Get all menus
    getAllMenus: async (req, res) => {
        try {
            const menus = await Menu.find();
            res.json(menus);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Read - Get menu by ID
    getMenuById: async (req, res) => {
        try {
            const menu = await Menu.findById(req.params.id);
            if (!menu) {
                return res.status(404).json({ message: 'Menu not found' });
            }
            res.json(menu);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update
    updateMenu: async (req, res) => {
        try {
            const { name, description, status } = req.body;  // Sửa menuName thành name
            const menu = await Menu.findById(req.params.id);
            
            if (!menu) {
                return res.status(404).json({ message: 'Menu not found' });
            }

            menu.name = name || menu.name;
            menu.description = description || menu.description;
            menu.status = status !== undefined ? status : menu.status;

            await menu.save();
            res.json(menu);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete
    deleteMenu: async (req, res) => {
        try {
            const menu = await Menu.findById(req.params.id);
            if (!menu) {
                return res.status(404).json({ message: 'Menu not found' });
            }
            await menu.deleteOne();  // Sửa remove() thành deleteOne()
            res.json({ message: 'Menu deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = menuController;