const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let categorySchema = require('../models/catgories')
let BuildQueies = require('../Utils/BuildQuery')
const categoryController = require('../controllers/categories');

//http://localhost:3000/products?name=iph&price[$gte]=1600&price[$lte]=3000
/* GET users listing. */
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.post('/', categoryController.createCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;