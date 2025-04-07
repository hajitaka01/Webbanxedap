let mongoose = require('mongoose');

let reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }],
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Tạo compound index để đảm bảo mỗi user chỉ review một sản phẩm một lần
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('review', reviewSchema); 