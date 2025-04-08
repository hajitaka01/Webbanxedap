const Review = require('../models/reviews');
const Order = require('../models/orders');

// Export theo dạng object
module.exports = {
    // Lấy đánh giá của sản phẩm
    getProductReviews: async (req, res) => {
        try {
            const { productId } = req.params;
            const reviews = await Review.find({ 
                product: productId,
                status: 'approved'
            })
            .populate('user', 'username avatarUrl')
            .sort({ createdAt: -1 });
            
            res.status(200).json({
                success: true,
                data: reviews
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    // Lấy tất cả đánh giá
    getAllReviews: async (req, res) => {
        try {
            // Nếu là admin, lấy tất cả đánh giá
            // Nếu là user thông thường, chỉ lấy đánh giá của user đó
            const query = req.user.role.roleName === 'admin' 
                ? {} 
                : { user: req.user._id };

            const reviews = await Review.find(query)
                .populate('user', 'username')
                .populate('product', 'productName')
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                data: reviews
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    // Lấy chi tiết đánh giá
    getReviewById: async (req, res) => {
        try {
            const review = await Review.findById(req.params.id)
                .populate('user', 'username')
                .populate('product', 'productName');

            if (!review) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Đánh giá không tồn tại' 
                });
            }

            // Kiểm tra quyền truy cập
            if (req.user.role.roleName !== 'admin' && 
                review.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Không có quyền truy cập đánh giá này' 
                });
            }

            res.status(200).json({
                success: true,
                data: review
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    // Tạo đánh giá mới
    createReview: async (req, res) => {
        try {
            const { product, rating, title, content, images } = req.body;
            const userId = req.user._id;

            // Kiểm tra xem user đã mua sản phẩm chưa
            const hasPurchased = await Order.findOne({
                user: userId,
                'items.product': product,
                status: 'delivered'
            });

            const newReview = new Review({
                user: userId,
                product,
                rating,
                title,
                content,
                images,
                isVerifiedPurchase: !!hasPurchased
            });

            await newReview.save();
            res.status(201).json({
                success: true,
                data: newReview
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    // Cập nhật đánh giá
    updateReview: async (req, res) => {
        try {
            const { rating, title, content, images } = req.body;
            const review = await Review.findById(req.params.id);

            if (!review) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Đánh giá không tồn tại' 
                });
            }

            // Kiểm tra quyền sửa đánh giá
            if (review.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Không có quyền sửa đánh giá này' 
                });
            }

            review.rating = rating;
            review.title = title;
            review.content = content;
            review.images = images;
            review.status = 'pending'; // Reset trạng thái khi cập nhật

            await review.save();
            res.status(200).json({
                success: true,
                data: review
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    // Xóa đánh giá
    deleteReview: async (req, res) => {
        try {
            const review = await Review.findById(req.params.id);

            if (!review) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Đánh giá không tồn tại' 
                });
            }

            // Kiểm tra quyền xóa
            if (review.user.toString() !== req.user._id.toString() && 
                req.user.role.roleName !== 'admin') {
                return res.status(403).json({ 
                    success: false,
                    message: 'Không có quyền xóa đánh giá này' 
                });
            }

            await review.deleteOne();
            res.status(200).json({ 
                success: true,
                message: 'Xóa đánh giá thành công' 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    },

    // Duyệt đánh giá (chỉ admin)
    approveReview: async (req, res) => {
        try {
            const { status } = req.body;
            const review = await Review.findById(req.params.id);

            if (!review) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Đánh giá không tồn tại' 
                });
            }

            review.status = status;
            await review.save();
            res.status(200).json({
                success: true,
                data: review
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    }
};