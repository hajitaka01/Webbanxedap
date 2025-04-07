const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
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
menuSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu; 