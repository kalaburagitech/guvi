const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Route for admin to submit a reply to a review
router.post('/admin/reply', async (req, res) => {
  const { reviewId, adminReply } = req.body;

  if (!reviewId || !adminReply) {
    return res.status(400).json({ message: "Review ID and admin reply are required" });
  }

  try {
    // Find the review by ID
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update the review with the admin reply
    review.adminReply = adminReply;
    await review.save();

    res.status(200).json({ message: "Admin reply added successfully", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
