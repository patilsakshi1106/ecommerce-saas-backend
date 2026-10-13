const Merchant = require('../models/merchant');
const bcrypt = require('bcryptjs');

// @desc    Register a new Merchant (Sign-up)
// @route   POST /api/auth/signup
exports.signupMerchant = async (req, res) => {
    try {
        const { name, email, password, storeName } = req.body;

        // 1. Check if merchant already exists
        const merchantExists = await Merchant.findOne({ email });
        if (merchantExists) {
            return res.status(400).json({ success: false, message: 'Merchant with this email already exists' });
        }

        // 2. Check if store name is already taken
        const storeExists = await Merchant.findOne({ storeName });
        if (storeExists) {
            return res.status(400).json({ success: false, message: 'Store name is already taken' });
        }

        // 3. Encrypt/Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create new merchant in Database
        const newMerchant = await Merchant.create({
            name,
            email,
            password: hashedPassword,
            storeName
        });

        res.status(201).json({
            success: true,
            message: 'Merchant registered successfully!',
            data: {
                id: newMerchant._id,
                name: newMerchant.name,
                email: newMerchant.email,
                storeName: newMerchant.storeName
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
// last bracket of signupMerchant function
// starting of loginMerchant function
exports.loginMerchant = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if merchant exists
        const merchant = await Merchant.findOne({ email });
        if (!merchant) {
            return res.status(400).json({ success: false, message: 'Invalid Email or Password' });
        }

        // 2. Check if password matches (Compare encrypted password)
        const isMatch = await bcrypt.compare(password, merchant.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid Email or Password' });
        }

        // 3. Login Successful Response
        res.status(200).json({
            success: true,
            message: 'Merchant logged in successfully! Welcome back 👋',
            data: {
                id: merchant._id,
                name: merchant.name,
                email: merchant.email,
                storeName: merchant.storeName
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};