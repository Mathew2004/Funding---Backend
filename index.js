// server.js (main app file)
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/admin'); // Import admin routes
const connectDB = require('./db/db');

connectDB();

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // for parsing application/json

// Use admin routes
app.use('/admin', adminRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
