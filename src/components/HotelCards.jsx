import { Card, CardContent, Grid2, Typography, CardMedia } from "@mui/material";
import { useParams } from 'react-router-dom';
import BookingModal from "./BookingModal";
import { useState, useEffect } from "react";

export default function HotelCards({ selectedTags, sort, searchedHotel }) {
  const username = localStorage.getItem("authToken");
  const [modalState, setModalState] = useState(null); // Make modalState hold the clicked hotel data
  const [restaurentInfo, setRestaurentInfo] = useState([]); // To hold the fetched hotel data
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null); // To handle errors during the fetch process

  const { location } = useParams();

  // Function to fetch restaurant data from the API
  useEffect(() => {
    const fetchHotelData = async () => {
      setLoading(true);
      setError(null); // Reset error state

      try {
        const cityName = location ? location.toLowerCase() : 'delhi';
        const response = await fetch(`http://localhost:5000/api/restaurants/${cityName}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch hotel data');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setRestaurentInfo(data); // Only set if data is an array
        } else {
          setRestaurentInfo([]); // Set an empty array if data is not valid
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [location]);

  // Apply search filter if searchedHotel exists
  useEffect(() => {
    if (searchedHotel) {
      setRestaurentInfo((prevData) =>
        prevData.filter((eachHotel) =>
          eachHotel.name.toLowerCase().includes(searchedHotel.toLowerCase())
        )
      );
    }
  }, [searchedHotel]);

  // Apply tags filter if selectedTags exists
  useEffect(() => {
    if (selectedTags?.length) {
      setRestaurentInfo((prevData) =>
        prevData.filter((eachHotel) => 
          eachHotel.tags.some((tag) => selectedTags.includes(tag))
        )
      );
    }
  }, [selectedTags]);

  // Sorting function
  const handleSort = (data) => {
    if (!Array.isArray(data)) return []; // Guard against non-array input

    const sortedData = [...data]; // Create a copy of the data to avoid mutating the original
    if (sort === 'Rating') {
      return sortedData.sort((a, b) => b.ratings - a.ratings);
    } else if (sort === 'Price High To Low') {
      return sortedData.sort((a, b) => b.price - a.price);
    } else if (sort === 'Price Low To High') {
      return sortedData.sort((a, b) => a.price - b.price);
    }
    return sortedData;
  };

  const sortedHotels = handleSort(restaurentInfo);

  const handleBookingModelOpen = (eachHotel) => {
    const hotelId = eachHotel.id;
    
    // Construct the API URL with the encoded city name and hotel ID
    const apiUrl = `http://localhost:5000/api/restaurants/${location}/${hotelId}`;
  
    if (username) {
      // Pass the location as lowercase
      setModalState({ ...eachHotel, location: location.toLowerCase() });
    } else {
      alert("Please log in first.");
    }
  };
  
  
  
  

  // Loading and error handling UI
  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <>
      <Grid2 container gap={1}>
        {sortedHotels.map((eachHotel) => {
          const { id, name, location, price, tags, priceDetail, ratings, image } = eachHotel;
          return (
            <Grid2 key={id} onClick={() => handleBookingModelOpen(eachHotel, location)} style={{ cursor: "pointer" }}>
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
                    {priceDetail} , {tags.join(" ")}
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
