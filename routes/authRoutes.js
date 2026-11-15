const express = require('express');
const router = express.Router();
const { signupMerchant,loginMerchant,forgotPassword,signupCustomer,loginCustomer} = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer'); 
const Merchant = require('../models/merchant');

// Protect Middleware to verify JWT Token
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 1. Check the Customer model first
      let user = await Customer.findById(decoded.id).select('-password');
      
      // 2. If not found in Customer, check the Merchant model
      if (!user) {
        user = await Merchant.findById(decoded.id).select('-password');
        if (user) {
          user.role = 'merchant'; // Explicitly assign merchant role
        }
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized, token failed." });
    }
  }
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token." });
  }
};
//B2B Merchant Routes
router.post('/signup', signupMerchant);
router.post('/login', loginMerchant);
router.post('/forgot-password', forgotPassword);
//B2C Customer Routes
router.post('/customer/signup', signupCustomer);
router.post('/customer/login', loginCustomer); // 💡 NEW: Add login route for customers
router.post('/customer/forgot-password', forgotPassword); // 💡 NEW: Add forgot password route for customers
// Middleware to verify if the user is a Merchant
const isMerchant = (req, res, next) => {
  if (req.user && (req.user.role === 'merchant' || req.user.role === 'admin')) {
    next(); // Merchants or Admins can access merchant panels
  } else {
    return res.status(403).json({ success: false, message: "Access denied! Merchant resource." });
  }
};

// Middleware to verify if the user is a Super Admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Only the main platform Admin can access
  } else {
    return res.status(403).json({ success: false, message: "Access denied! Super Admin resource." });
  }
};

// Middleware to verify if the user is a Customer
const isCustomer = (req, res, next) => {
  if (req.user && req.user.role === 'customer') {
    next(); // Only customers can access customer resources
  } else {
    return res.status(403).json({ success: false, message: "Access denied! Customer resource only." });
  }
};
// 1. MERCHANT DASHBOARD DATA (Specific to that vendor)
router.get('/merchant/dashboard-stats', isMerchant, async (req, res) => {
  try {
    const merchantStats = {
      myProductsCount: 14,
      myTotalSales: 15200,
      myPendingOrders: 4
    };
    res.status(200).json({ success: true, data: merchantStats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching merchant stats" });
  }
});

// 2. SUPER ADMIN DASHBOARD DATA (Total platform overview)
router.get('/admin/dashboard-stats', isAdmin, async (req, res) => {
  try {
    const globalStats = {
      totalPlatformRevenue: 85400,
      totalActiveMerchants: 12,
      totalRegisteredCustomers: 140,
      totalOrdersAllOver: 320
    };
    res.status(200).json({ success: true, data: globalStats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching admin stats" });
  }
});
// Forgot Password Route to generate reset token
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // 1. Check if the user exists in your Customer model
    const user = await Customer.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User with this email does not exist." });
    }

    // 2. Mock success response for now until you connect Email Services (like Nodemailer)
    res.status(200).json({
      success: true,
      message: "Reset link has been generated and sent to your email dynamically."
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error during forgot password request",
      error: error.message
    });
  }
});
module.exports ={ router,protect, isMerchant, isAdmin, isCustomer };