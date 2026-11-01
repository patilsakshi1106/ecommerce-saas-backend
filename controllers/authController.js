const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Merchant = require('../models/merchant');
const Customer = require('../models/customer');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
// ==========================================
// 🏢 B2B MERCHANT CONTROLLERS
// ==========================================

// @desc    Register a new Merchant (Sign-up)
// @route   POST /api/auth/signup
exports.signupMerchant = async (req, res) => {
    try {
        const { name, email, password, storeName, gstNumber } = req.body;

        // 1. Check if merchant already exists
        const merchantExists = await Merchant.findOne({ email });
        if (merchantExists) {
            return res.status(400).json({ success: false, message: "Merchant with this email already exists" });
        }

        // 2. Check if store name is already taken
        const storeExists = await Merchant.findOne({ storeName });
        if (storeExists) {
            return res.status(400).json({ success: false, message: "Store name is already taken" });
        }

        // 3. Validate GST Number input specifically for the B2B side
        if (!gstNumber) {
            return res.status(400).json({ success: false, message: "GST number is mandatory for business onboarding" });
        }

        if (gstNumber.trim().length !== 15) {
            return res.status(400).json({ success: false, message: "Please enter a valid 15-digit GST number" });
        }

        // 4. Encrypt/Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Create new merchant in Database
        const merchant = await Merchant.create({
            name,
            email,
            password: hashedPassword,
            storeName,
            gstNumber
        });

        if (merchant) {
            return res.status(201).json({
                success: true,
                message: "Merchant registered successfully!",
                data: {
                    _id: merchant._id,
                    name: merchant.name,
                    email: merchant.email,
                    storeName: merchant.storeName,
                    gstNumber: merchant.gstNumber
                }
            });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Login existing Merchant
// @route   POST /api/auth/login
exports.loginMerchant = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if merchant exists
        const merchant = await Merchant.findOne({ email });
        if (!merchant) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // 2. Check if password matches
        const isMatch = await bcrypt.compare(password, merchant.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // 3. Generate JWT token for Merchant
        const token = jwt.sign(
            { id: merchant._id, role: 'merchant' },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // 4. Login Successful Response
        res.status(200).json({
            success: true,
            message: "Merchant logged in successfully! Welcome back 👋",
            token,
            data: {
                _id: merchant._id,
                name: merchant.name,
                email: merchant.email,
                storeName: merchant.storeName
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// ==========================================
// 🛍️ B2C CUSTOMER CONTROLLERS
// ==========================================

// @desc    Register a new Customer (B2C Sign-up)
// @route   POST /api/auth/customer/signup
exports.signupCustomer = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if email is already taken in the customer database
        const customerExists = await Customer.findOne({ email });
        if (customerExists) {
            return res.status(400).json({ success: false, message: "Customer with this email already exists" });
        }

        // 2. Encrypt/Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save the new regular customer record to MongoDB
        const customer = await Customer.create({
            name,
            email,
            password: hashedPassword
        });

        if (customer) {
            return res.status(201).json({
                success: true,
                message: "Customer registered successfully!",
                data: {
                    _id: customer._id,
                    name: customer.name,
                    email: customer.email
                }
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Login existing Customer (B2C Login)
// @route   POST /api/auth/customer/login
exports.loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Verify if the customer exists in the database
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // 2. Validate if the encrypted password matches
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // 3. Generate JWT token for Customer
        const token = jwt.sign(
            { id: customer._id, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // 4. Return successful login data along with the security token
        res.status(200).json({
            success: true,
            message: "Customer logged in successfully! Welcome back 👋",
            token,
            data: {
                _id: customer._id,
                name: customer.name,
                email: customer.email
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
// Password Recovery Controller for both Merchants and Customers
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Check if a merchant exists with this email
        let user = await Merchant.findOne({ email });
        let userType = 'merchant';

        // 2. If not a merchant, check if a customer exists
        if (!user) {
            user = await Customer.findOne({ email });
            userType = 'customer';
        }

        // 3. If the email doesn't match any user or merchant
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email address."
            });
        }

        // 4. Generate a random reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // 5. Save hashed token and expiry to DB
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
        await user.save();

        // 6. Create the dynamic reset URL pointing to your frontend based on user role
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}?role=${userType}`;

        // TEMPORARY: Log it to your terminal so you can click it!
        console.log("==========================================");
        console.log(`PASSWORD RESET LINK INDEED GENERATED FOR ${userType.toUpperCase()}:`);
        console.log(resetUrl);
        console.log("==========================================");
        // 1. Create email transporter using Gmail service
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // 👈 Replace with your real Gmail address
        pass: process.env.EMAIL_PASS // 👈 Use an App Password for Gmail
    }
});
// 2. Define email structure and options
const mailOptions = {
    from: process.env.EMAIL_USER,     // 👈 Replace with your real Gmail address
    to: user.email,                   // Dynamically sends to the user/merchant who requested the reset
    subject: 'Password Reset Request',
    text: `You requested a password reset. Please click on the link below to reset your password:\n\n${resetUrl}`
};

// 3. Trigger the asynchronous email delivery
await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: `Password reset link sent to your email. (${userType} account)`
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};