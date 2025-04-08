const userSchema = require('../models/user');
const roleSchema = require('../models/role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constants = require('../Utils/constants');
const BuildQueries = require('../Utils/BuildQuery');
const { check_authentication, check_authorization } = require('../Utils/check_auth');

// Get list of users (GET)
async function getUsers(req, res) {
  let queries = req.query;
  try {
    let users = await userSchema.find(BuildQueries.QueryUser(queries)).populate('role');
    res.send(users);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
}

// Get user details by ID (GET)
async function getUserById(req, res, next) {
  try {
    if (req.user._id == req.params.id) {
      let user = await userSchema.findById(req.params.id).populate('role');
      res.status(200).send({
        success: true,
        data: user
      });
    } else {
      throw new Error("You do not have permission");
    }
  } catch (error) {
    next(error);
  }
}

// Create new user (POST)
async function createUser(req, res, next) {
  try {
    let body = req.body;
    let result = await userController.createUser(
      body.username,
      body.password,
      body.email,
      body.role
    );
    res.status(200).send({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

// Update user information (PUT)
async function updateUser(req, res, next) {
  try {
    let body = req.body;
    let user = await userSchema.findById(req.params.id).populate({
      path: "role", select: "roleName"
    });
    if (user) {
      let allowField = ["password", "email", "fullName", "avatarUrl"];
      for (const key of Object.keys(body)) {
        if (allowField.includes(key)) {
          user[key] = body[key];
        }
      }
      await user.save();
      res.status(200).send({
        success: true,
        data: user
      });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser
};