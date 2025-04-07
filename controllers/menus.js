const Menu = require('../models/menu');

const menuController = {
    // Create
    createMenu: async (req, res) => {
        try {
            const { menuName, description } = req.body;
            const newMenu = new Menu({
                menuName,
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
            const { menuName, description, status } = req.body;
            const menu = await Menu.findById(req.params.id);
            
            if (!menu) {
                return res.status(404).json({ message: 'Menu not found' });
            }

            menu.menuName = menuName || menu.menuName;
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
            await menu.remove();
            res.json({ message: 'Menu deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = menuController; 