const express = require('express');
const router = express.Router();
const {  getAllRestaurants, getRestaurantByCityAndId } = require('../controllers/restaurantController');



// Route to get all restaurant data
router.get('/restaurants', getAllRestaurants);

// Define the route to get a restaurant by city and id
router.get('/restaurants/:city/:id', getRestaurantByCityAndId);

module.exports = router;
