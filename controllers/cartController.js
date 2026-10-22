const Cart = require('../models/cart');
const Product = require('../models/product');

// @desc    Add an item to the shopping cart
// @route   POST /api/cart/add
exports.addToCart = async (req, res) => {
    try {
        const { customerId, productId, quantity } = req.body;
        const itemQuantity = quantity || 1;

        // 1. Verify the product actually exists in the catalog first
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // 2. Find if the customer already has an existing cart record
        let cart = await Cart.findOne({ customerId });

        if (!cart) {
            // Case A: If no cart exists, create a brand new one for them
            cart = await Cart.create({
                customerId,
                items: [{ productId, quantity: itemQuantity }]
            });
        } else {
            // Case B: Cart exists. Check if this product is already in their basket
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (itemIndex > -1) {
                // If product exists, just add the new quantity to the old one
                cart.items[itemIndex].quantity += itemQuantity;
            } else {
                // If it's a completely new product, push it into the items array
                cart.items.push({ productId, quantity: itemQuantity });
            }
            cart.updatedAt = Date.now();
            await cart.save();
        }

        res.status(200).json({
            success: true,
            message: "Item successfully added to cart!",
            data: cart
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @desc    Get a specific customer's cart contents
// @route   GET /api/cart/:customerId
exports.getCart = async (req, res) => {
    try {
        // Find cart and automatically pull product details like name and price
        const cart = await Cart.findOne({ customerId: req.params.customerId })
            .populate('items.productId', 'name price category');

        if (!cart) {
            return res.status(200).json({ success: true, message: "Cart is empty", items: [] });
        }

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};