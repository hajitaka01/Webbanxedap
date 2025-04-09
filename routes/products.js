const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');
const { check_authentication, check_authorization } = require('../Utils/check_auth');

//  GET: Xem danh sách và chi tiết sản phẩm → yêu cầu quyền "product:read"
router.get('/', check_authentication, check_authorization(['product:read']), productController.getProducts);
router.get('/:id', check_authentication, check_authorization(['product:read']), productController.getProductById);

//  POST: Tạo sản phẩm → yêu cầu quyền "product:create"
router.post('/', check_authentication, check_authorization(['product:create']), productController.createProduct);

//  PUT: Cập nhật sản phẩm → yêu cầu quyền "product:update"
router.put('/:id', check_authentication, check_authorization(['product:update']), productController.updateProduct);

// DELETE: Xóa sản phẩm → yêu cầu quyền "product:delete"
router.delete('/:id', check_authentication, check_authorization(['product:delete']), productController.deleteProduct);

module.exports = router;
