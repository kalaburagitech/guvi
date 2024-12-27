import { Card, CardContent, Grid2, Typography, CardMedia } from "@mui/material";
import { useParams } from 'react-router-dom';
import BookingModal from "./BookingModal";
import { useState } from "react";

export default function HotelCards({ selectedTags, hotelData, sort, searchedHotel }) {
  const username = localStorage.getItem("authToken");
  const [modalState, setModalState] = useState(null); // Make modalState hold the clicked hotel data

  const { location } = useParams();

  let restaurentInfo = [];
  if (location?.toLowerCase()) {
    restaurentInfo = hotelData[location?.toLowerCase()];
  } else {
    restaurentInfo = hotelData['delhi'];
  }

  if (searchedHotel) {
    restaurentInfo = restaurentInfo.filter(eachHotel => {
      if (eachHotel.name.toLowerCase().includes(searchedHotel.toLowerCase())) {
        return true;
      }
      return false;
    });
  }

  if (selectedTags?.length) {
    restaurentInfo = restaurentInfo.filter(eachHotel => {
      let matchFound = false;
      eachHotel.tags.forEach(ele => {
        if (selectedTags.includes(ele)) {
          matchFound = true;
        }
      });
      return matchFound;
    });
  }

  const handleBookingModelOpen = (eachHotel) => {
    // Extract city from the location string (e.g., 'Okhla, South Delhi' -> 'Delhi')
    const locationParts = eachHotel.location.trim().split(","); // Split by comma to isolate the city part
  
    // Get the last part of the location string and normalize the city name
    let cityName = locationParts[locationParts.length - 1].trim(); // Take the last part and remove extra spaces
    
    // Handle specific prefixes like "Central", "South", etc.
    // If the city name contains terms like "Central" or "South", remove them
    const prefixesToRemove = ['Central', 'South', 'North', 'East'];
    prefixesToRemove.forEach(prefix => {
      cityName = cityName.replace(prefix, "").trim();  // Remove any prefix and trim spaces
    });
  
    // Normalize the city name: lowercase and remove any spaces
    cityName = cityName.toLowerCase().replace(/\s+/g, '');  // Remove spaces and lowercase
  
    // Construct the API URL with the correct format (city in lowercase and hotel ID at the end)
    const hotelId = eachHotel.id;
    const apiUrl = `http://localhost:5000/api/restaurants/${cityName}/${hotelId}`;
    
    // Check if the user is logged in and pass the correct data to the modal
    if (username) {
      setModalState({ ...eachHotel, location: cityName }); // Pass the formatted city name
      console.log("Booking modal opened for hotel in", cityName, "with ID:", hotelId); // Log for debugging
      console.log("Constructed API URL:", apiUrl); // Check the final API URL
    } else {
      alert("Please log in first.");
    }
  };
  
  
  
  

  const handleRatingSort = (restaurentInfo) => {
    restaurentInfo.sort((a, b) => a.ratings > b.ratings ? -1 : 1);
  };

  if (sort === 'Rating') {
    handleRatingSort(restaurentInfo);
  } else if (sort === 'Price High To Low') {
    restaurentInfo.sort((a, b) => a.price > b.price ? -1 : 1);
  } else if (sort === 'Price Low To High') {
    restaurentInfo.sort((a, b) => a.price > b.price ? 1 : -1);
  }

  return (
    <>
      <Grid2 container gap={1}>
        {restaurentInfo.map((eachHotel) => {
          const { id, name, location, price, tags, priceDetail, ratings, image } = eachHotel;
          return (
            <Grid2 onClick={() => handleBookingModelOpen(eachHotel)} id={eachHotel.id} style={{ cursor: "pointer" }}>
              <Card sx={{ maxWidth: 345 }}>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      backgroundColor: "rgba(192, 226, 21, 0.93)",
                      width: 50,
                      height: 25,
                      borderRadius: 20,
                      textAlign: "center",
                      right: 10,
                      top: 10,
                      color: "white",
                    }}
                  >
                    {ratings}
                  </div>
                  <CardMedia sx={{ height: 250 }} image={image} title={name} />
                </div>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {location}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {priceDetail} , {tags.map((e) => e + " ")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          );
        })}
      </Grid2>

      {/* Pass the hotel data to the modal */}
      <BookingModal
        modalState={modalState} // Hotel data passed to modal
        handleClose={() => setModalState(null)} // Close the modal by resetting modalState
      />
    </>
  );
}
