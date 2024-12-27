const mongoose = require('mongoose');
const restaurantSchema = mongoose.Schema({
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    location: { type: String, required: true },
    priceRange: { type: String, required: true },
    menu: [{ type: String }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
    availability: [{ date: String, timeSlots: [String] }]
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
