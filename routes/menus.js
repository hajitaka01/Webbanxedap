const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menus');
const { check_authentication, check_authorization } = require('../Utils/check_auth');

// Lấy danh sách menus
router.get('/', 
  check_authentication, 
  check_authorization(['VIEW']), 
  menuController.getAllMenus
);

// Lấy chi tiết menu
router.get('/:id', 
  check_authentication, 
  check_authorization(['VIEW']), 
  menuController.getMenuById
);

// Tạo menu mới
router.post('/', 
  check_authentication, 
  check_authorization(['CRUD']), 
  menuController.createMenu
);

// Cập nhật menu
router.put('/:id', 
  check_authentication, 
  check_authorization(['CRUD']), 
  menuController.updateMenu
);

// Xóa menu
router.delete('/:id', 
  check_authentication, 
  check_authorization(['CRUD']), 
  menuController.deleteMenu
);

module.exports = router;