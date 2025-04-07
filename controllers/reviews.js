const Review = require('../models/reviews');
const Order = require('../models/orders');

const reviewController = {
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
            res.status(201).json(newReview);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy danh sách đánh giá của sản phẩm
    getProductReviews: async (req, res) => {
        try {
            const { productId } = req.params;
            const reviews = await Review.find({ 
                product: productId,
                status: 'approved'
            })
            .populate('user', 'username avatarUrl')
            .sort({ createdAt: -1 });
            
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Lấy đánh giá của user cho sản phẩm
    getUserReview: async (req, res) => {
        try {
            const { productId } = req.params;
            const userId = req.user._id;

            const review = await Review.findOne({
                user: userId,
                product: productId
            });

            res.json(review);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Cập nhật đánh giá
    updateReview: async (req, res) => {
        try {
            const { rating, title, content, images } = req.body;
            const review = await Review.findById(req.params.id);

            if (!review) {
                return res.status(404).json({ message: 'Đánh giá không tồn tại' });
            }

            // Kiểm tra quyền sửa đánh giá
            if (review.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Không có quyền sửa đánh giá này' });
            }

            review.rating = rating;
            review.title = title;
            review.content = content;
            review.images = images;
            review.status = 'pending'; // Reset trạng thái khi cập nhật

            await review.save();
            res.json(review);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Xóa đánh giá
    deleteReview: async (req, res) => {
        try {
            const review = await Review.findById(req.params.id);

            if (!review) {
                return res.status(404).json({ message: 'Đánh giá không tồn tại' });
            }

            // Kiểm tra quyền xóa
            if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Không có quyền xóa đánh giá này' });
            }

            await review.remove();
            res.json({ message: 'Đánh giá đã được xóa' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Duyệt đánh giá (admin)
    approveReview: async (req, res) => {
        try {
            const { status } = req.body;
            const review = await Review.findById(req.params.id);

            if (!review) {
                return res.status(404).json({ message: 'Đánh giá không tồn tại' });
            }

            review.status = status;
            await review.save();
            res.json(review);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = reviewController; 