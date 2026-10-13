const Product = require('../models/product');

// @desc    Create a new product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    try {
        const { merchantId, name, price, description, image, stock } = req.body;

        // Create product in Database
        const newProduct = await Product.create({
            merchantId,
            name,
            price,
            description,
            image,
            stock
        });

        res.status(201).json({
            success: true,
            message: 'Product added successfully! 🛍️',
            data: newProduct
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};