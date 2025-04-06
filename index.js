// server.js (main app file)
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/admin');
const paymentRoute = require("./routes/payment");

const connectDB = require('./db/db');

const cors = require("cors");

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors()); // Allow requests from frontend



connectDB();


// Middleware
app.use(express.json()); // for parsing application/json

// Use admin routes
app.use('/admin', adminRoutes);
app.use("/donate", paymentRoute);



app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
