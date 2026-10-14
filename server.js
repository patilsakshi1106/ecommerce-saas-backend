const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // 1. Imported Mongoose library
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'PUBLIC')));

// Product Routes
app.use('/api/products', productRoutes);

//Auth Routes
app.use('/api/auth', authRoutes);

// 2. Database Connection Logic
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Database Connected Successfully! 🎉');
        // Only start listening once the database is safely connected
        app.listen(PORT, () => {
            console.log(`🚀 Server is running smoothly on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database Connection Error: ', err);
    });

// 3. Basic Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'PUBLIC', 'loginpage.html'));
});