var express = require('express');
var router = express.Router();
let userSchema = require('../models/user');
const userController = require('../controllers/users');
let BuildQueries = require('../Utils/BuildQuery');
let { check_authentication, check_authorization } = require('../Utils/check_auth');
let constants = require('../Utils/constants');
let multer = require('multer');
let path = require('path');
let axios = require('axios');
let FormData = require('form-data');
let fs = require('fs');

router.get('/', userController.getUsers);

router.get('/:id', check_authentication, userController.getUserById);

router.post('/',
  check_authentication,
  check_authorization(constants.MOD_PERMISSION),
  userController.createUser);

router.put('/:id', userController.updateUser);

module.exports = router;