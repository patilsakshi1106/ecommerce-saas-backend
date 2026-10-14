const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, updateProduct, deleteProduct } = require('../controllers/ProductController');

// Map GET and POST requests to the root path
router.route('/')
.post(createProduct)
.get(getAllProducts);

// Map PUT and DELETE requests to the product ID path
router.route('/:id')
.put(updateProduct)
.delete(deleteProduct);

module.exports = router;