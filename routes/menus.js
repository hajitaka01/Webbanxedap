const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menus');
const auth = require('../Utils/check_auth');

// Tất cả các route đều yêu cầu xác thực
router.use(auth.check_authentication);

// Create
router.post('/', menuController.createMenu);

// Read
router.get('/', menuController.getAllMenus);
router.get('/:id', menuController.getMenuById);

// Update
router.put('/:id', menuController.updateMenu);

// Delete
router.delete('/:id', menuController.deleteMenu);

module.exports = router;
