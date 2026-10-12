const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // 1. Imported Mongoose library
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

//Auth Routes
app.use('/api/auth', authRoutes);

// 2. Database Connection Logic
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Database Connected Successfully! 🚀'))
    .catch((err) => console.error('Database Connection Error: ', err));

// 3. Basic Route
app.get('/', (req, res) => {
    res.send('My first e-commerce backend server has started successfully!');
});

// 4. Server Port Setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}.`);
});