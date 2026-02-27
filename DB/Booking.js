const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  phoneNumber: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true 
  },
  checkIn: { 
    type: Date, 
    required: true 
  },
  checkOut: { 
    type: Date, 
    required: true 
  },
  experience: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    trim: true 
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;