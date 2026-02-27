const mongoose = require('mongoose');

const festivalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Festival name is required'],
    trim: true
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true
  },
  imageUrl: {
    type: String,
    default: 'https://placeholder.com/diwali.jpg'
  },
  badge: {
    type: String,
    enum: ['Popular', 'New', 'Limited', 'Featured', null],
    default: null
  },
  description: {
    type: String,
    required: true,
    maxLength: [500, 'Description cannot exceed 500 characters']
  },
  // This maps to your .map() function for the checkmarks
  features: [{
    type: String,
    required: true
  }],
  // Useful for the "Inquire for Dates" logic
  availability: {
    startDate: Date,
    endDate: Date,
    isBookingOpen: {
      type: Boolean,
      default: true
    }
  },
  price: {
    amount: Number,
    currency: { type: String, default: 'USD' }
  }
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

const Festival = mongoose.model('Festival', festivalSchema);

module.exports = Festival;