const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Link to the user collection where merchant roles exist
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;