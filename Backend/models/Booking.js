const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  hotelId: { type: String, required: true },
  selectedDate: { type: String, required: true },
  selectedTime: { type: String, required: true },
  selectedSeats: { type: Number, required: true },
  status: { type: String, default: "pending" }, // Default status
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
