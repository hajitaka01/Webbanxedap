const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/services');
const { check_authentication, check_authorization } = require('../Utils/check_auth');

// Lấy danh sách dịch vụ
router.get('/', 
  check_authentication, 
  check_authorization(['VIEW', 'CRUD_SERVICES']), 
  serviceController.getAllServices
);

// Lấy chi tiết dịch vụ
router.get('/:id', 
  check_authentication, 
  check_authorization(['VIEW', 'CRUD_SERVICES']), 
  serviceController.getServiceById
);

// Tạo dịch vụ mới
router.post('/', 
  check_authentication, 
  check_authorization(['CRUD_SERVICES']), 
  serviceController.createService
);

// Cập nhật trạng thái dịch vụ
router.put('/:id/status', 
  check_authentication, 
  check_authorization(['CRUD_SERVICES']), 
  serviceController.updateServiceStatus
);

// Gán kỹ thuật viên
router.put('/:id/assign', 
  check_authentication, 
  check_authorization(['CRUD']), 
  serviceController.assignTechnician
);

// Hủy dịch vụ
router.put('/:id/cancel', 
  check_authentication, 
  check_authorization(['CRUD_SERVICES']), 
  serviceController.cancelService
);

// Xóa dịch vụ
router.delete('/:id', 
  check_authentication, 
  check_authorization(['CRUD_SERVICES']), 
  serviceController.deleteService
);

module.exports = router;