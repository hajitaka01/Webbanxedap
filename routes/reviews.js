const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviews');
const auth = require('../Utils/check_auth');

// Lấy danh sách đánh giá của sản phẩm (public)
router.get('/product/:productId', reviewController.getProductReviews);

// Các route yêu cầu xác thực
router.use(auth.check_authentication);

// Tạo đánh giá mới
router.post('/', reviewController.createReview);

// Lấy đánh giá của user cho sản phẩm
router.get('/user/:productId', reviewController.getUserReview);

// Cập nhật đánh giá
router.put('/:id', reviewController.updateReview);

// Xóa đánh giá
router.delete('/:id', reviewController.deleteReview);

// Duyệt đánh giá (admin)
router.patch('/:id/approve', auth.check_authorization(['admin']), reviewController.approveReview);

module.exports = router; 