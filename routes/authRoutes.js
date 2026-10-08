const express = require('express');
const router = express.Router();
const { signupMerchant } = require('../controllers/authController');

// Route for merchant signup
router.post('/signup', signupMerchant);

module.exports = router;