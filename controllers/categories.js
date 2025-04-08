const categorySchema = require('../models/catgories');
const BuildQueies = require('../Utils/BuildQuery');
const mongoose = require('mongoose');

// Get list of categories (GET)
async function getCategories(req, res) {
  try {
    let categories = await categorySchema.find({});
    res.status(200).send({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

// Get category details by ID (GET)
async function getCategoryById(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        success: false,
        message: 'Invalid ID format',
      });
    }

    let category = await categorySchema.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).send({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

// Update category information (PUT)
async function updateCategory(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        success: false,
        message: 'Invalid ID format',
      });
    }

    let body = req.body;
    let category = await categorySchema.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true }
    );

    if (!category) {
      return res.status(404).send({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).send({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

// Add new category (POST)
async function createCategory(req, res) {
  try {
    let body = req.body;
    let newCategory = new categorySchema({
      categoryName: body.categoryName,
      description: body.description,
      type: body.type,
      image: body.image,
    });
    await newCategory.save();
    res.status(201).send({
      success: true,
      data: newCategory,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

// Delete category (DELETE)
async function deleteCategory(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        success: false,
        message: 'Invalid ID format',
      });
    }

    let category = await categorySchema.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  updateCategory,
  createCategory,
  deleteCategory
}; 