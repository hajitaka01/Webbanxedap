const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: Number, // Thời gian thực hiện dịch vụ (phút)
        required: true,
        min: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Cập nhật updatedAt trước khi lưu
serviceSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service; 