const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/services');
const auth = require('../Utils/check_auth');

// Tất cả các route đều yêu cầu xác thực
router.use(auth.check_authentication);

// Tạo yêu cầu dịch vụ mới
router.post('/', serviceController.createService);

// Lấy danh sách dịch vụ của user
router.get('/user', serviceController.getUserServices);

// Lấy chi tiết dịch vụ
router.get('/:id', serviceController.getServiceDetail);

// Cập nhật trạng thái dịch vụ (admin/technician)
router.patch('/:id/status', auth.check_authorization(['admin', 'technician']), serviceController.updateServiceStatus);

// Gán kỹ thuật viên (admin)
router.patch('/:id/assign', auth.check_authorization(['admin']), serviceController.assignTechnician);

// Hủy dịch vụ
router.patch('/:id/cancel', serviceController.cancelService);

module.exports = router; 