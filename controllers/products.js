const productSchema = require('../models/products');
const BuildQueies = require('../Utils/BuildQuery');

// Get list of products with search conditions (GET)
async function getProducts(req, res) {
  let queries = req.query;
  try {
    let products = await productSchema.find(BuildQueies.QueryProduct(queries)).populate("categoryID");
    res.status(200).send({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
}

// Get product details by ID (GET)
async function getProductById(req, res) {
  try {
    let product = await productSchema.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
}

// Add new product (POST)
async function createProduct(req, res) {
  let body = req.body;
  try {
    let newProduct = new productSchema({
      productName: body.productName,
      brand: body.brand,
      price: body.price,
      quantity: body.quantity,
      description: body.description || "",
      imgURL: body.imgURL || "",
      categoryID: body.categoryID,
      frameSize: body.frameSize,
      wheelSize: body.wheelSize,
      color: body.color,
      material: body.material
    });

    await newProduct.save();
    res.status(201).send({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

// Update product information (PUT)
async function updateProduct(req, res) {
  try {
    let body = req.body;
    let product = await productSchema.findByIdAndUpdate(req.params.id, body, { new: true });

    if (!product) {
      return res.status(404).send({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).send({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
}

// Delete product (DELETE)
async function deleteProduct(req, res) {
  try {
    let product = await productSchema.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).send({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}; 