const RestaurantData = require('../models/Restaurant');


// Get all restaurant data
const getAllRestaurants = async (req, res) => {
    try {
      const restaurants = await RestaurantData.find();  // Fetch all restaurant data
      res.status(200).json(restaurants);  // Return the data
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Controller to get a restaurant by city and id
const getRestaurantByCityAndId = async (req, res) => {
    const { city, id } = req.params;  // Extract city and id from the request parameters
  
    try {
      // Find the restaurant data by city and id
      const restaurantData = await RestaurantData.findOne();
  
      // Check if the restaurant data exists
      if (!restaurantData) {
        return res.status(404).json({ message: 'Restaurant data not found' });
      }
  
      // Extract the city data (Delhi, Mumbai, Chennai)
      const cityData = restaurantData[city];  // e.g., 'delhi', 'mumbai', 'chennai'
  
      // Find the specific restaurant by id in the chosen city
      const restaurant = cityData.find((item) => item.id === id);
  
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
  
      // Return the found restaurant data
      res.status(200).json(restaurant);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  // Controller to get restaurants by city
// Controller to get restaurants by city
const getRestaurantsByCity = async (req, res) => {
  const { city } = req.params;  // Extract city from the request parameters

  try {
      // Fetch the restaurant data
      const restaurantData = await RestaurantData.findOne();  // Use RestaurantData here

      // Check if the restaurant data exists
      if (!restaurantData) {
          return res.status(404).json({ message: 'Restaurant data not found' });
      }

      // Check if the city exists in the data (Delhi, Mumbai, Chennai, etc.)
      const cityData = restaurantData[city];  // Extract the data for the specified city

      // If the city does not exist in the data, return a 404 error
      if (!cityData) {
          return res.status(404).json({ message: `${city} not found` });
      }

      // Return the found restaurants for the specified city
      res.status(200).json(cityData);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

  
  

module.exports = { getAllRestaurants, getRestaurantByCityAndId, getRestaurantsByCity };
