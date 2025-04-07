const Order = require('../models/orders');
const Product = require('../models/products');

const orderController = {
    // Tạo đơn hàng mới
    createOrder: async (req, res) => {
        try {
            const { items, shippingAddress, phone, paymentMethod, notes } = req.body;
            const userId = req.user._id;

            // Tính tổng số tiền
            let totalAmount = 0;
            for (const item of items) {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(404).json({ message: `Sản phẩm ${item.product} không tồn tại` });
                }
                if (product.quantity < item.quantity) {
                    return res.status(400).json({ message: `Sản phẩm ${product.productName} không đủ số lượng` });
                }
                totalAmount += product.price * item.quantity;
            }

            const newOrder = new Order({
                user: userId,
                items,
                totalAmount,
                shippingAddress,
                phone,
                paymentMethod,
                notes
            });

            // Cập nhật số lượng sản phẩm
            for (const item of items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { quantity: -item.quantity }
                });
            }

            await newOrder.save();
            res.status(201).json(newOrder);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy danh sách đơn hàng của user
    getUserOrders: async (req, res) => {
        try {
            const userId = req.user._id;
            const orders = await Order.find({ user: userId })
                .populate('items.product')
                .sort({ createdAt: -1 });
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy chi tiết đơn hàng
    getOrderDetail: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id)
                .populate('items.product')
                .populate('user', 'username email phone');
            
            if (!order) {
                return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
            }

            // Kiểm tra quyền truy cập
            if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Không có quyền truy cập' });
            }

            res.json(order);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Cập nhật trạng thái đơn hàng (admin)
    updateOrderStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const order = await Order.findById(req.params.id);

            if (!order) {
                return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
            }

            order.status = status;
            await order.save();
            res.json(order);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Hủy đơn hàng
    cancelOrder: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);

            if (!order) {
                return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
            }

            // Chỉ cho phép hủy đơn hàng ở trạng thái pending
            if (order.status !== 'pending') {
                return res.status(400).json({ message: 'Không thể hủy đơn hàng ở trạng thái này' });
            }

            // Kiểm tra quyền hủy đơn hàng
            if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Không có quyền hủy đơn hàng này' });
            }

            // Hoàn trả số lượng sản phẩm
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { quantity: item.quantity }
                });
            }

            order.status = 'cancelled';
            await order.save();
            res.json(order);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = orderController; 