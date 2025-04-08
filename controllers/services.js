const Service = require('../models/services');

// Export theo dạng object với tất cả các method
module.exports = {
    // Lấy tất cả dịch vụ
    getAllServices: async (req, res) => {
        try {
            // Nếu là admin, lấy tất cả dịch vụ
            // Nếu là user thông thường, chỉ lấy dịch vụ của user đó
            const query = req.user.role.roleName === 'admin' 
                ? {} 
                : { user: req.user._id };

            const services = await Service.find(query)
                .populate('user', 'username')
                .populate('technician', 'username')
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                data: services
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    // Lấy chi tiết dịch vụ
    getServiceById: async (req, res) => {
        try {
            const service = await Service.findById(req.params.id)
                .populate('user', 'username phone')
                .populate('technician', 'username');

            if (!service) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Dịch vụ không tồn tại' 
                });
            }

            // Kiểm tra quyền truy cập
            if (req.user.role.roleName !== 'admin' && 
                service.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Không có quyền truy cập dịch vụ này' 
                });
            }

            res.status(200).json({
                success: true,
                data: service
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    // Tạo dịch vụ mới
    createService: async (req, res) => {
        try {
            const {
                bikeType,
                bikeBrand,
                bikeModel,
                serviceType,
                description,
                appointmentDate
            } = req.body;

            const newService = new Service({
                user: req.user._id,
                bikeType,
                bikeBrand,
                bikeModel,
                serviceType,
                description,
                appointmentDate
            });

            await newService.save();
            res.status(201).json({
                success: true,
                data: newService
            });
        } catch (error) {
            res.status(400).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    // Cập nhật trạng thái dịch vụ
    updateServiceStatus: async (req, res) => {
        try {
            const { status, actualCost, notes, partsUsed } = req.body;
            const service = await Service.findById(req.params.id);

            if (!service) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Dịch vụ không tồn tại' 
                });
            }

            service.status = status;
            if (actualCost) service.actualCost = actualCost;
            if (notes) service.notes = notes;
            if (partsUsed) service.partsUsed = partsUsed;
            
            if (status === 'completed') {
                service.completionDate = new Date();
            }

            await service.save();
            res.status(200).json({
                success: true,
                data: service
            });
        } catch (error) {
            res.status(400).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    // Gán kỹ thuật viên
    assignTechnician: async (req, res) => {
        try {
            const { technicianId } = req.body;
            const service = await Service.findById(req.params.id);

            if (!service) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Dịch vụ không tồn tại' 
                });
            }

            service.technician = technicianId;
            await service.save();
            res.status(200).json({
                success: true,
                data: service
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    // Hủy dịch vụ
    cancelService: async (req, res) => {
        try {
            const service = await Service.findById(req.params.id);

            if (!service) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Dịch vụ không tồn tại' 
                });
            }

            // Chỉ cho phép hủy khi ở trạng thái pending
            if (service.status !== 'pending') {
                return res.status(400).json({ 
                    success: false,
                    message: 'Không thể hủy dịch vụ ở trạng thái này' 
                });
            }

            service.status = 'cancelled';
            await service.save();
            res.status(200).json({
                success: true,
                data: service
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    // Xóa dịch vụ
    deleteService: async (req, res) => {
        try {
            const service = await Service.findById(req.params.id);

            if (!service) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Dịch vụ không tồn tại' 
                });
            }

            // Chỉ cho phép xóa khi ở trạng thái cancelled
            if (service.status !== 'cancelled') {
                return res.status(400).json({ 
                    success: false,
                    message: 'Chỉ được xóa dịch vụ đã hủy' 
                });
            }

            await service.deleteOne();
            res.status(200).json({ 
                success: true,
                message: 'Xóa dịch vụ thành công' 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    }
};