const Product = require('../models/product');

// @desc    Create a new product
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    try {
        const { merchantId, name, price, description, image, stock, category } = req.body;
        const imageUrl1 = req.file ? req.file.path : 'https://placeholder.com'; // Use uploaded image or default placeholder
        // Create product in Database
        const newProduct = await Product.create({
            merchantId,
            name,
            price,
            description,
            image: imageUrl1,
            stock,
            category,
            merchantId: req.user.id // Assuming req.user is populated by authentication middleware
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
        let query = {};
        //if the logged-in user is a merchant, filter products by their merchantId
        if (req.user && req.user.role === 'merchant') {
            query.merchantId = req.user.id;
        }
        const products = await Product.find(query).populate('merchantId', 'name email'); // Populate merchant details

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
        // Check if the logged-in user is the owner of the product
        if (product.merchantId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to update this product" });
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

        // Check if the logged-in user is the owner of the product
        if (product.merchantId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this product" });
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
// Get Low Stock Inventory Alerts for the logged-in Merchant
exports.getLowStockAlerts = async (req, res) => {
  try {
    const lowStockThreshold = 10; // Alert limit (e.g., 10 items or fewer)
    const merchantId = req.user.id; // Logged-in merchant's ID

    // Find products belonging to this merchant where stock is <= 10
    const lowStockProducts = await Product.find({
      merchantId: merchantId,
      stock: { $lte: lowStockThreshold }
    }).select('name stock price category image');

    res.status(200).json({
      success: true,
      alertCount: lowStockProducts.length,
      message: lowStockProducts.length > 0 
        ? `${lowStockProducts.length} products are running low on stock!` 
        : "All inventory stock levels are healthy.",
      data: lowStockProducts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error while fetching inventory alerts",
      error: error.message
    });
  }
};