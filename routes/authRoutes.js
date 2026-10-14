const express = require('express');
const router = express.Router();
const { signupMerchant,loginMerchant,signupCustomer,loginCustomer} = require('../controllers/authController');

//B2B Merchant Routes
router.post('/signup', signupMerchant);
router.post('/login', loginMerchant);
//B2C Customer Routes
router.post('/customer/signup', signupCustomer);
router.post('/customer/login', loginCustomer); // 💡 NEW: Add login route for customers

module.exports = router;