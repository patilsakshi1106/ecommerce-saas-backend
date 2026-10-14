const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    // 💡 Links this specific cart to a single registered customer
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
        unique: true // One customer can only have one active cart
    },
    // 🛍️ An array storing all the items currently in their basket
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'Quantity cannot be less than 1'],
                default: 1
            }
        }
    ],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cart', cartSchema);