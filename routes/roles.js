const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roles');
const { check_authentication, check_authorization } = require('../Utils/check_auth');

// Lấy danh sách roles (chỉ admin)
router.get('/', 
  check_authentication, 
  check_authorization(['CRUD', 'VIEW']), 
  roleController.getAllRoles
);

// Lấy chi tiết role (chỉ admin)
router.get('/:id', 
  check_authentication, 
  check_authorization(['CRUD', 'VIEW']), 
  roleController.getRoleById
);

// Tạo role mới (chỉ admin)
router.post('/', 
  check_authentication, 
  check_authorization(['CRUD']), 
  roleController.createRole
);

// Cập nhật role (chỉ admin)
router.put('/:id', 
  check_authentication, 
  check_authorization(['CRUD']), 
  roleController.updateRole
);

// Xóa role (chỉ admin)
router.delete('/:id', 
  check_authentication, 
  check_authorization(['CRUD']), 
  roleController.deleteRole
);

module.exports = router;