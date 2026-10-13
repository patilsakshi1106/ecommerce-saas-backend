const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a full name'],
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
        minlength: [6, 'Password must be at least 6 characters long']
    },
    storeName: {
        type: String,
        required: [true, 'Please add your store name'],
        trim: true
    },
    gstNumber: {
        type: String,
        required: [true, 'Please add a business GST number'],
        unique: true,
        trim: true,
        match: [
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            'Please add a valid 15-digit GST number'
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Merchant', merchantSchema);