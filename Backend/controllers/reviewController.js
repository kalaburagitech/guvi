const Restaurant = require('../models/restaurant'); // Import the restaurant model

// Get all restaurants
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find(); // Retrieve all restaurants
        res.status(200).json(restaurants); // Send response
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Get a restaurant by ID
const getRestaurantById = async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters
    try {
        const restaurant = await Restaurant.findById(id); // Find restaurant by ID
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(200).json(restaurant); // Send the restaurant data
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Create a new restaurant
const createRestaurant = async (req, res) => {
    const newRestaurant = new Restaurant(req.body); // Create a new restaurant from request body
    try {
        const savedRestaurant = await newRestaurant.save(); // Save the new restaurant to the database
        res.status(201).json(savedRestaurant); // Send back the saved restaurant data
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

module.exports = { getAllRestaurants, getRestaurantById, createRestaurant }; // Export the controller functions
