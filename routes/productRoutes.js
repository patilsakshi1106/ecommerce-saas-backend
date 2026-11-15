const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, updateProduct, deleteProduct, getLowStockAlerts } = require('../controllers/ProductController');
const upload = require('../config/cloudinaryConfig');

// Import authorization middlewares from authRoutes
const { protect,isMerchant} = require('./authRoutes'); 

// Map GET and POST requests to the root path
router.route('/')
  .get(getAllProducts)
  .post(protect, isMerchant, upload.single('image'), createProduct); 

 // Map GET request to fetch low stock alerts
router.route('/alerts')
  .get(protect, isMerchant, getLowStockAlerts);

// Map PUT and DELETE requests to the product ID path
router.route('/:id')
  .put(protect, isMerchant, upload.single('image'), updateProduct)
  .delete(protect, isMerchant, deleteProduct);

module.exports = router;