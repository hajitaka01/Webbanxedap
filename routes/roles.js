const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roles');
const auth = require('../Utils/check_auth');

// Tất cả các route đều yêu cầu xác thực và quyền admin
router.use(auth.check_authentication);
router.use(auth.check_authorization(['admin']));

// Create
router.post('/', roleController.createRole);

// Read
router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);

// Update
router.put('/:id', roleController.updateRole);

// Delete
router.delete('/:id', roleController.deleteRole);

module.exports = router;