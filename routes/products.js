const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let productSchema = require('../models/products');
let BuildQueies = require('../Utils/BuildQuery');
const productController = require('../controllers/products');

// Lấy danh sách sản phẩm với điều kiện tìm kiếm (GET)
router.get('/', productController.getProducts);

// Lấy chi tiết sản phẩm theo ID (GET)
router.get('/:id', productController.getProductById);

// Thêm sản phẩm mới (POST)
router.post('/', productController.createProduct);

// Cập nhật thông tin sản phẩm (PUT)
router.put('/:id', productController.updateProduct);

// Xóa sản phẩm (DELETE)
router.delete('/:id', productController.deleteProduct);

module.exports = router;
