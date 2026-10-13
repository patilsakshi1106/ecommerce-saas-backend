const express = require('express');
const router = express.Router();
const { createProduct, getProducts } = require('../controllers/productController');

// Map GET and POST requests to the root path
router.route('/')
    .post(createProduct)
    .get(getProducts);

module.exports = router;