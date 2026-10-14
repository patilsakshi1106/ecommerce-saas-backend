const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts } = require('../controllers/ProductController');

// Map GET and POST requests to the root path
router.route('/')
.post(createProduct)
.get(getAllProducts);

module.exports = router;