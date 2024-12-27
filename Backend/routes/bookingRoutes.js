const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Create a new booking
router.post('/book', async (req, res) => {
  try {
    const { userId, hotelId, selectedDate, selectedTime, selectedSeats, status } = req.body;

    const newBooking = new Booking({
      userId,
      hotelId,
      selectedDate,
      selectedTime,
      selectedSeats,
      status
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// Get all bookings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('hotelId');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Error fetching user bookings', error: error.message });
  }
});

// Get all bookings for a hotel on a specific date
router.get('/hotel/:hotelId/:date', async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      hotelId: req.params.hotelId,
      selectedDate: req.params.date
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching hotel bookings:', error);
    res.status(500).json({ message: 'Error fetching hotel bookings', error: error.message });
  }
});

module.exports = router;