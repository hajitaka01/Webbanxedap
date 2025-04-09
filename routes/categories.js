const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categories');
const auth = require('../Utils/check_auth'); // Middleware xác thực & phân quyền

// Lấy danh sách tất cả category - yêu cầu đăng nhập
router.get(
  '/',
  auth.check_authentication,
  categoryController.getCategories
);

// Xem chi tiết category theo ID - yêu cầu đăng nhập
router.get(
  '/:id',
  auth.check_authentication,
  categoryController.getCategoryById
);

// Thêm mới category - chỉ admin
router.post(
  '/',
  auth.check_authentication,
  auth.check_authorization(['category:create']),
  categoryController.createCategory
);

// Cập nhật category - chỉ admin
router.put(
  '/:id',
  auth.check_authentication,
  auth.check_authorization(['category:update']),
  categoryController.updateCategory
);

// Xóa category - chỉ admin
router.delete(
  '/:id',
  auth.check_authentication,
  auth.check_authorization(['category:delete']),
  categoryController.deleteCategory
);

module.exports = router;
