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
      discount: { type: Number, required: true },
      menuItems: [String],  // Add menuItems array
      contact: {  // Add contact details
        phone: { type: String, required: true },
        email: { type: String, required: true }
      },
      hoursOfOperation: { type: String, required: true },  // Add hours of operation
      photoGallery: [String]  // Add photo gallery
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
      discount: { type: Number, required: true },
      menuItems: [String],
      contact: {
        phone: { type: String, required: true },
        email: { type: String, required: true }
      },
      hoursOfOperation: { type: String, required: true },
      photoGallery: [String]
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
      discount: { type: Number, required: true },
      menuItems: [String],
      contact: {
        phone: { type: String, required: true },
        email: { type: String, required: true }
      },
      hoursOfOperation: { type: String, required: true },
      photoGallery: [String]
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
      discount: { type: Number, required: true },
      menuItems: [String],
      contact: {
        phone: { type: String, required: true },
        email: { type: String, required: true }
      },
      hoursOfOperation: { type: String, required: true },
      photoGallery: [String]
    }
  ]
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
