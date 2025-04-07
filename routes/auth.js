const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { check_authentication } = require('../Utils/check_auth');
let crypto = require('crypto')
let mailMiddleware = require('../Utils/sendMail')

// Đăng ký tài khoản mới
router.post('/register', authController.register);

// Đăng nhập
router.post('/login', authController.login);

router.get('/me', check_authentication, async function (req, res, next) {
  try {
    res.status(200).send({
      success: true,
      data: req.user
    })
  } catch (error) {
    next();
  }
})

router.post('/forgotpasswood', async function (req, res, next) {
  let body = req.body;
  let email = body.email;
  let user = await userController.getUserByEmail(email);
  user.resetPasswordToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordTokenExp = new Date(Date.now() + 30 * 60 * 1000).getTime();
  await user.save();
  let url = `http://localhost:3000/auth/changepasswordforgot/${user.resetPasswordToken}`;
  let result = await mailMiddleware.sendmail(user.email, "link tim lai mk", url)
  res.send({
    message: `da gui thanh cong`
  })
})

router.post('/changepasswordforgot/:token', async function (req, res, next) {
  let body = req.body;
  let token = req.params.token;
  let password = body.password
  let user = await userController.getUserByToken(token)
  if (user.resetPasswordTokenExp > Date.now()) {
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExp = null;
    await user.save();
    res.send("da up date password")
  } else {
    res.send("token khong chinh xac")
  }
})

module.exports = router;