const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// 💡 1. Imported Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

// 💡 2. Middlewares
app.use(cors());
app.use(express.json());

// 💡 3. Connect the Capital 'PUBLIC' folder safely for frontend static files
app.use(express.static(path.join(__dirname, 'PUBLIC')));

// 💡 4. Auth & Functional API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// 💡 5. Database Connection Logic
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce-saas";

mongoose.connect(mongoURI)
    .then(() => {
        console.log("MongoDB Database Connected Successfully! 🌱");
        app.listen(PORT, () => console.log(`Server is running on port ${PORT} 🚀`));
    })
    .catch((error) => {
        console.error("Database connection configuration failed:", error.message);
    });