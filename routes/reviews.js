const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviews');
const { check_authentication, check_authorization } = require('../Utils/check_auth');

// Lấy danh sách đánh giá của sản phẩm
router.get('/product/:productId', 
  check_authentication, 
  check_authorization(['VIEW']), 
  reviewController.getProductReviews
);

// Lấy danh sách đánh giá
router.get('/', 
  check_authentication, 
  check_authorization(['VIEW', 'CRUD_REVIEWS']), 
  reviewController.getAllReviews
);

// Lấy chi tiết đánh giá
router.get('/:id', 
  check_authentication, 
  check_authorization(['VIEW', 'CRUD_REVIEWS']), 
  reviewController.getReviewById
);

// Tạo đánh giá mới
router.post('/', 
  check_authentication, 
  check_authorization(['CRUD_REVIEWS']), 
  reviewController.createReview
);

// Cập nhật đánh giá
router.put('/:id', 
  check_authentication, 
  check_authorization(['CRUD_REVIEWS']), 
  reviewController.updateReview
);

// Xóa đánh giá
router.delete('/:id', 
  check_authentication, 
  check_authorization(['CRUD_REVIEWS']), 
  reviewController.deleteReview
);

// Duyệt đánh giá (chỉ admin)
router.put('/:id/approve', 
  check_authentication, 
  check_authorization(['CRUD']), 
  reviewController.approveReview
);

module.exports = router;