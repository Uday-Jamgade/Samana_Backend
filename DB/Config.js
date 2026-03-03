const mongoose = require("mongoose");
require('dotenv').config();
const url = process.env.URL;

mongoose.connect(url, {
  tls: true,
  tlsAllowInvalidCertificates: true,
  directConnection: true,
  retryWrites: true,
  serverSelectionTimeoutMS: 10000,
})
  .then(() => {
    console.log("Connected to MongoDB successfully");   
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });