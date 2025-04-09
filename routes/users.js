const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { check_authentication, check_authorization } = require('../Utils/check_auth');

// Lấy danh sách người dùng (chỉ admin hoặc có quyền manage_users)
router.get('/',
  check_authentication,
  check_authorization(['manage_users']),
  userController.getUsers
);

// Lấy thông tin người dùng theo ID
router.get('/:id',
  check_authentication,
  check_authorization(['manage_users']),
  userController.getUserById
);

// Tạo người dùng mới
router.post('/',
  check_authentication,
  check_authorization(['manage_users']),
  userController.createUser
);

// Cập nhật thông tin người dùng
router.put('/:id',
  check_authentication,
  check_authorization(['manage_users']),
  userController.updateUser
);

module.exports = router;
