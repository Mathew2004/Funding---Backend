const express = require('express');
const mongoose = require('mongoose');


// Admin model (simplified for this example)
const Admin = mongoose.model('Admin', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

module.exports = Admin;