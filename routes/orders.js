const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');
const { check_authentication, check_authorization } = require('../Utils/check_auth');

// Lấy danh sách đơn hàng
router.get('/', 
  check_authentication, 
  check_authorization(['VIEW', 'CRUD_ORDERS']), 
  orderController.getAllOrders  // Đảm bảo method được gọi chính xác
);

// Lấy chi tiết đơn hàng
router.get('/:id', 
  check_authentication, 
  check_authorization(['VIEW', 'CRUD_ORDERS']), 
  orderController.getOrderById
);

// Tạo đơn hàng mới
router.post('/', 
  check_authentication, 
  check_authorization(['CRUD_ORDERS']), 
  orderController.createOrder
);

// Cập nhật trạng thái đơn hàng
router.put('/:id/status', 
  check_authentication, 
  check_authorization(['CRUD_ORDERS']), 
  orderController.updateOrderStatus
);

// Hủy đơn hàng
router.put('/:id/cancel', 
  check_authentication, 
  check_authorization(['CRUD_ORDERS']), 
  orderController.cancelOrder
);

// Xóa đơn hàng
router.delete('/:id', 
  check_authentication, 
  check_authorization(['CRUD_ORDERS']), 
  orderController.deleteOrder
);

module.exports = router;