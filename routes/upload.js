const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/') // Đảm bảo thư mục này tồn tại
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
    },
    fileFilter: function (req, file, cb) {
        // Chỉ cho phép upload ảnh
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Chỉ cho phép upload file ảnh!'), false);
        }
        cb(null, true);
    }
});

// Route xử lý upload file
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Không có file được upload'
            });
        }

        // Trả về đường dẫn của file
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({
            success: true,
            imageUrl: imageUrl
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router; 