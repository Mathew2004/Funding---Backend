const express = require('express');
const mongoose = require('mongoose');

const Donation = mongoose.model('Donation', new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    amount: { 
        type: Number,
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
}));

module.exports = Donation;