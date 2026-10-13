const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please add a product price']
    },
    description: {
        type: String,
        required: [true, 'Please add a product description']
    },
    image: {
        type: String,
        default: 'https://placeholder.com'
    },
    stock: {
        type: Number,
        required: [true, 'Please add product stock count'],
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);