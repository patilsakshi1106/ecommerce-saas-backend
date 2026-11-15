const mongoose = require('mongoose');

const groupOrderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  targetQuantity: { 
    type: Number, 
    required: true // The minimum bulk threshold set by the merchant (e.g., 5000)
  },
  currentQuantity: { 
    type: Number, 
    default: 0 // Total quantity gathered so far across all participants (e.g., starts at 3000)
  },
  status: {
    type: String,
    enum: ['Open', 'Completed', 'Expired'],
    default: 'Open' // Remains 'Open' until the target quantity threshold is completely fulfilled
  },
  participants: [
    {
      customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
      requestedQuantity: { type: Number, required: true }, // Individual share (e.g., Customer A wants 3000, Customer B wants 2000)
      shippingAddress: { type: String, required: true },
      isPaid: { type: Boolean, default: false }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GroupOrder', groupOrderSchema);