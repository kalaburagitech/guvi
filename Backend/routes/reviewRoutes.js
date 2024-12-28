const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const router = express.Router();

// POST route to submit a review
// POST route to submit a review
router.post('/submit-review', async (req, res) => {
    try {
      const { hotelId, name, userId, rating, review } = req.body;
  
      // Validate hotelId and userId as UUIDs (no change needed here)
      if (!hotelId || !userId || !name || typeof hotelId !== 'string' || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Invalid hotelId or userId format' });
      }
  
      // Search for hotelId in any of the location arrays (delhi, mumbai, etc.)
      const hotel = await Restaurant.findOne({
        $or: [
          { "delhi.id": hotelId },
          { "mumbai.id": hotelId },
          { "chennai.id": hotelId },
          { "bengaluru.id": hotelId },
        ],
      });
  
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
  
      // Validate if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create a new review
      const newReview = new Review({
        hotelId,
        userName: name,  // Use "name" from the payload instead of "userName"
        userId,
        rating,
        review,
      });
  
      await newReview.save();
  
      // Optionally, update the hotel's average rating if needed
      const reviews = await Review.find({ hotelId });
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
      hotel.ratings = avgRating;
      await hotel.save();
  
      return res.status(201).json({ message: 'Review submitted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// GET route to fetch reviews for a specific hotel
router.get('/get-reviews/:hotelId', async (req, res) => {
  try {
    const { hotelId } = req.params;

    // Validate the hotelId format (UUID format)
    if (typeof hotelId !== 'string') {
      return res.status(400).json({ message: 'Invalid hotelId format' });
    }

    // Find all reviews for the given hotelId
    const reviews = await Review.find({ hotelId });

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this hotel' });
    }

    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
