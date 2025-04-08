const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const userController = require('../controllers/users');
const { check_authentication } = require('../Utils/check_auth');
const crypto = require('crypto');
const mailMiddleware = require('../Utils/sendMail');

// Đăng ký
router.post('/register', authController.register);

// Đăng nhập
router.post('/login', authController.login);

// Đăng xuất
router.post('/logout', check_authentication, authController.logout);

// Lấy thông tin người dùng hiện tại (cần token)
router.get('/me', check_authentication, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        fullName: req.user.fullName,
        role: req.user.role?.roleName || 'user'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng', error: error.message });
  }
});

// Gửi email quên mật khẩu
router.post('/forgotpassword', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userController.getUserByEmail(email);

    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng với email này' });

    user.resetPasswordToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordTokenExp = Date.now() + 30 * 60 * 1000; // 30 phút

    await user.save();

    const resetLink = `http://localhost:3000/auth/changepasswordforgot/${user.resetPasswordToken}`;
    await mailMiddleware.sendmail(user.email, 'Password Reset Link', resetLink);

    res.status(200).json({ message: 'Đã gửi liên kết đặt lại mật khẩu thành công', resetLink });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi quên mật khẩu', error: error.message });
  }
});

// Đổi mật khẩu qua token
router.post('/changepasswordforgot/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await userController.getUserByToken(token);

    if (!user || user.resetPasswordTokenExp < Date.now()) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExp = null;
    await user.save();

    res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đổi mật khẩu', error: error.message });
  }
});

module.exports = router;
