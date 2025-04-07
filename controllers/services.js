const Service = require('../models/services');

const serviceController = {
    // Tạo yêu cầu dịch vụ mới
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
            res.status(201).json(newService);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy danh sách dịch vụ của user
    getUserServices: async (req, res) => {
        try {
            const services = await Service.find({ user: req.user._id })
                .sort({ appointmentDate: -1 });
            res.json(services);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy chi tiết dịch vụ
    getServiceDetail: async (req, res) => {
        try {
            const service = await Service.findById(req.params.id)
                .populate('user', 'username phone')
                .populate('technician', 'username');

            if (!service) {
                return res.status(404).json({ message: 'Dịch vụ không tồn tại' });
            }

            // Kiểm tra quyền truy cập
            if (service.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Không có quyền truy cập' });
            }

            res.json(service);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Cập nhật trạng thái dịch vụ (admin/technician)
    updateServiceStatus: async (req, res) => {
        try {
            const { status, actualCost, notes, partsUsed } = req.body;
            const service = await Service.findById(req.params.id);

            if (!service) {
                return res.status(404).json({ message: 'Dịch vụ không tồn tại' });
            }

            service.status = status;
            if (actualCost) service.actualCost = actualCost;
            if (notes) service.notes = notes;
            if (partsUsed) service.partsUsed = partsUsed;
            
            if (status === 'completed') {
                service.completionDate = new Date();
            }

            await service.save();
            res.json(service);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Gán kỹ thuật viên (admin)
    assignTechnician: async (req, res) => {
        try {
            const { technicianId } = req.body;
            const service = await Service.findById(req.params.id);

            if (!service) {
                return res.status(404).json({ message: 'Dịch vụ không tồn tại' });
            }

            service.technician = technicianId;
            await service.save();
            res.json(service);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Hủy dịch vụ
    cancelService: async (req, res) => {
        try {
            const service = await Service.findById(req.params.id);

            if (!service) {
                return res.status(404).json({ message: 'Dịch vụ không tồn tại' });
            }

            // Chỉ cho phép hủy khi ở trạng thái pending
            if (service.status !== 'pending') {
                return res.status(400).json({ message: 'Không thể hủy dịch vụ ở trạng thái này' });
            }

            service.status = 'cancelled';
            await service.save();
            res.json(service);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = serviceController; 