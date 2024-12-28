const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
router.post('/create-booking', async (req, res) => {
  try {
    const { userId, userName, userEmail, hotelId, selectedDate, selectedTime, selectedSeats } = req.body;

    if (!userId || !userName || !userEmail || !hotelId || !selectedDate || !selectedTime || !selectedSeats) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newBooking = new Booking({
      userId,
      userName,
      userEmail,
      hotelId,
      selectedDate,
      selectedTime,
      selectedSeats,
      status: "pending", // Explicitly set the status
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Fetch bookings by userId
router.get('/bookings/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find bookings for the given userId
    const bookings = await Booking.find({ userId });

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No user found or no bookings available." });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
});

router.put('/cancelBooking/:bookingId', async (req, res) => {
  const { bookingId } = req.params;

  console.log("Received bookingId:", bookingId); // Add this log

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Failed to cancel booking." });
  }
});

// Fetch all bookings for admin
router.get('/all-bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found.' });
    }
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings.' });
  }
});

// Update booking status (already exists)
router.put('/updateBooking/:bookingId', async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: 'Booking updated successfully.' });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Failed to update booking.' });
  }
});




module.exports = router;