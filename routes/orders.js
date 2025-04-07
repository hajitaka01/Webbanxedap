const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');
const auth = require('../Utils/check_auth');

// Tất cả các route đều yêu cầu xác thực
router.use(auth.check_authentication);

// Tạo đơn hàng mới
router.post('/', orderController.createOrder);

// Lấy danh sách đơn hàng của user
router.get('/user', orderController.getUserOrders);

// Lấy chi tiết đơn hàng
router.get('/:id', orderController.getOrderDetail);

// Cập nhật trạng thái đơn hàng (admin)
router.patch('/:id/status', auth.check_authorization(['admin']), orderController.updateOrderStatus);

// Hủy đơn hàng
router.patch('/:id/cancel', orderController.cancelOrder);

module.exports = router; 