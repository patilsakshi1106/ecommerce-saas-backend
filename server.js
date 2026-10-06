const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("My first e-commerce backend server has started successfully! 🚀");
});
app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}.`);
});