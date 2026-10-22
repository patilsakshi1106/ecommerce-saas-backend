const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, updateProduct, deleteProduct } = require('../controllers/ProductController');
const upload = require('../config/cloudinaryConfig');

// Map GET and POST requests to the root path
router.route('/')
.post(upload.single('image'), createProduct) // Protect the POST route for creating products
.get(getAllProducts);

// Map PUT and DELETE requests to the product ID path
router.route('/:id')
.put(upload.single('image'), updateProduct)
.delete(deleteProduct);

module.exports = router;