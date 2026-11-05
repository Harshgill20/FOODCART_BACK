const mongoose = require('mongoose');

// One document per dish, with a price on each delivery platform
const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    image: { type: String, default: '' },
    prices: {
      Blinkit: { type: Number, required: true, min: 0 },
      Swiggy: { type: Number, required: true, min: 0 },
      Zomato: { type: Number, required: true, min: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Food', foodSchema);
