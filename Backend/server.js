const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);
// Use the restaurant routes
app.use('/api', restaurantRoutes);
app.use('/api', bookingRoutes);

// Use the review routes
app.use('/api', reviewRoutes); // All review routes are prefixed with /api
// Use admin routes
app.use('/api', adminRoutes);

// app.use('/api/reviews', reviewRoutes);
// app.use('/api/reservations', reservationRoutes);

// Error Handling
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
