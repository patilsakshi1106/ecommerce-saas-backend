const Product = require('../models/product');

// @desc    Create a new product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    try {
        const { merchantId, name, price, description, image, stock, category } = req.body;

        // Create product in Database
        const newProduct = await Product.create({
            merchantId,
            name,
            price,
            description,
            image,
            stock,
            category
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
// @note    this endpoint doesn't require a merchantId because any consumer can browse items
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('merchantId', 'name storeName'); // Populate merchant details

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
// @desc    Update an existing product (Merchant Dashboard)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Update the product fields with incoming data
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: "Product updated successfully!",
            data: product
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Delete a product (Merchant Dashboard)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully from inventory!"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};