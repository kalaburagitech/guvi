// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  hotelId: { type: String, required: true },  // Change this to `String` to store UUID
  userName: { type: String, required: true },  // Change this to `String` to store UUID
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
