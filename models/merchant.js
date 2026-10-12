const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
   name: {
        type: String,
        required: [true, 'Please add afull name'],
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
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Merchant', merchantSchema);