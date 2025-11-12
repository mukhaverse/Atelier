const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  dimensions: {
    type: String,
  },
  attachment: {
    type: String,
  },
  description: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  isGift: {
    type: Boolean,
    default: false
  },
  artistEmail: {
    type: String,
  },
  userEmail: {
    type: String,
  },
  username: {
    type: String,
  },
  dateSubmitted: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'New'
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Commission', commissionSchema);