const mongoose = require("mongoose");
require('dotenv').config();
const url = process.env.URL;

mongoose.connect(url, {
  tls: true,
  retryWrites: true,
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log("Connected to MongoDB successfully");   
    })