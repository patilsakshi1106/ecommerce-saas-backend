const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email address'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minLength: [6, 'Password must be at least 6 characters long']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;