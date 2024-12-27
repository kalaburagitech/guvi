const mongoose = require('mongoose');

// Define the schema for restaurant data
const restaurantSchema = new mongoose.Schema({
  delhi: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      location: { type: String, required: true },
      price: { type: String, required: true },
      priceDetail: { type: String, required: true },
      tags: [String],
      ratings: { type: String, required: true },
      image: { type: String, required: true },
      discount: { type: Number, required: true }
    }
  ],
  mumbai: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      location: { type: String, required: true },
      price: { type: String, required: true },
      priceDetail: { type: String, required: true },
      tags: [String],
      ratings: { type: String, required: true },
      image: { type: String, required: true },
      discount: { type: Number, required: true }
    }
  ],
  chennai: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      location: { type: String, required: true },
      price: { type: String, required: true },
      priceDetail: { type: String, required: true },
      tags: [String],
      ratings: { type: String, required: true },
      image: { type: String, required: true },
      discount: { type: Number, required: true }
    }
  ],
  bengaluru: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      location: { type: String, required: true },
      price: { type: String, required: true },
      priceDetail: { type: String, required: true },
      tags: [String],
      ratings: { type: String, required: true },
      image: { type: String, required: true },
      discount: { type: Number, required: true }
    }
  ]
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
