const express = require('express');
const router = express.Router();
const { signupMerchant} = require('../controllers/authController');

// Routes
router.post('/signup', signupMerchant);

module.exports = router;