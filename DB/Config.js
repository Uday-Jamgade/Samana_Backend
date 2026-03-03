const mongoose = require("mongoose");
require('dotenv').config();
const url = process.env.URL;

mongoose.connect(url,{
  tlsAllowInvalidCertificates: false,
  tlsInsecure: false
})
  .then(() => {
    console.log("Connected to MongoDB successfully");   
    })