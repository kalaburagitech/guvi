const express = require('express');
const router = express.Router();
const {  getAllRestaurants, getRestaurantByCityAndId, getRestaurantsByCity } = require('../controllers/restaurantController');



// Route to get all restaurant data
router.get('/restaurants', getAllRestaurants);

// Define the route to get a restaurant by city and id
router.get('/restaurants/:city/:id', getRestaurantByCityAndId);
router.get('/restaurants/:city', getRestaurantsByCity);

module.exports = router;
