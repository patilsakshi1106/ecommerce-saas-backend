const express = require('express');
const router = express.Router();
const { createGroupOrder, joinGroupOrder } = require('../controllers/groupOrderController');

// Import your authentication token validation middleware
const { protect } = require('./authRoutes'); 

// Route to initialize a brand new bulk group order pool
router.post('/create', protect, createGroupOrder);

// Route to join an existing active group order pool using its unique ID
router.put('/join/:groupOrderId', protect, joinGroupOrder);
const { getMerchantSalesGraphData } = require('../controllers/orderController');
// Route to fetch monthly revenue analytics for the logged-in Merchant's graph
router.get('/merchant/sales-graph', protect, getMerchantSalesGraphData);

module.exports = router;