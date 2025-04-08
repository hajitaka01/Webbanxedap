const Order = require('../models/orders');
const Product = require('../models/products');

// Đảm bảo export các method
module.exports = {
    getAllOrders: async (req, res) => {
        try {
            const query = req.user.role.roleName === 'admin' 
                ? {} 
                : { user: req.user._id };

            const orders = await Order.find(query)
                .populate('user', 'username email')
                .populate('items.product');

            res.status(200).json({
                success: true,
                data: orders
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    getOrderById: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id)
                .populate('user', 'username email')
                .populate('items.product');

            if (!order) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Đơn hàng không tồn tại' 
                });
            }

            // Kiểm tra quyền truy cập
            if (req.user.role.roleName !== 'admin' && 
                order.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Không có quyền truy cập đơn hàng này' 
                });
            }

            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    createOrder: async (req, res) => {
        try {
            const { items, shippingAddress, phone, paymentMethod, notes } = req.body;
            const userId = req.user._id;

            // Logic tạo đơn hàng tương tự như trước
            let totalAmount = 0;
            const processedItems = [];

            for (const item of items) {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(404).json({ 
                        success: false,
                        message: `Sản phẩm ${item.product} không tồn tại` 
                    });
                }

                if (product.quantity < item.quantity) {
                    return res.status(400).json({ 
                        success: false,
                        message: `Sản phẩm ${product.productName} không đủ số lượng` 
                    });
                }

                const itemTotal = product.price * item.quantity;
                totalAmount += itemTotal;

                processedItems.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price
                });
            }

            const newOrder = new Order({
                user: userId,
                items: processedItems,
                totalAmount,
                shippingAddress,
                phone,
                paymentMethod,
                notes
            });

            for (const item of processedItems) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { quantity: -item.quantity }
                });
            }

            await newOrder.save();
            res.status(201).json({
                success: true,
                data: newOrder
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    // Các method khác
    updateOrderStatus: async (req, res) => {
        // Tương tự các method trước
    },

    cancelOrder: async (req, res) => {
        // Tương tự các method trước
    },

    deleteOrder: async (req, res) => {
        // Tương tự các method trước
    }
};