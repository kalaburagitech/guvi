import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  Slider,
  Chip,
  Button,
  IconButton,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { LocationOn, Star, AttachMoney, Group, Close } from "@mui/icons-material";

export default function BookingModal({ handleClose, modalState }) {
  const { id, location } = modalState || {};
  const { enqueueSnackbar } = useSnackbar();
  const username = localStorage.getItem("authToken");

  const [bookingState, setBookingState] = useState({
    selectedTime: "",
    selectedDate: "",
    selectedSeats: 1,
  });

  const [hotelDetails, setHotelDetails] = useState(null);
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id && location) {
      setBookingState({
        selectedTime: "",
        selectedDate: "",
        selectedSeats: 1,
      });
      getHotelDetails(location, id);
    }
  }, [id, location]);

  const getHotelDetails = async (city, hotelId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/restaurants/${city}/${hotelId}`);
      const data = response.data;

      if (data) {
        setHotelDetails(data);
      } else {
        enqueueSnackbar("Hotel not found!", { variant: "error" });
      }
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      enqueueSnackbar("Error fetching hotel details!", { variant: "error" });
    }
  };

  const handleSliderChange = (event, newValue) => {
    setBookingState({
      ...bookingState,
      selectedSeats: newValue,
    });
  };

  const handleChipClick = (eachTime) => {
    setBookingState({
      ...bookingState,
      selectedTime: eachTime,
    });
  };

  const handleDateChange = (event) => {
    const selectedDate = event ? event.format("DD-MM-YYYY") : "";
    setBookingState({
      ...bookingState,
      selectedDate,
    });
    if (selectedDate) {
      getBookingSlots(selectedDate);
    }
  };

  const handleBooking = async () => {
    setIsLoading(true);
    const { selectedDate, selectedTime, selectedSeats } = bookingState;
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo ? userInfo.id : null;

    if (userId && id && selectedDate && selectedTime && selectedSeats) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/bookings",
          {
            userId,
            hotelId: id,
            selectedDate,
            selectedTime,
            selectedSeats,
            status: "booked"
          }
        );
        if (response.data && response.data._id) {
          setBookingState({
            selectedTime: "",
            selectedDate: "",
            selectedSeats: 1,
          });
          handleClose();
          enqueueSnackbar("Booking created successfully!", { variant: "success" });
        } else {
          throw new Error("Booking creation failed");
        }
      } catch (error) {
        console.error("Error creating booking:", error);
        enqueueSnackbar("Error creating booking!", { variant: "error" });
      } finally {
        setIsLoading(false);
      }
    } else {
      enqueueSnackbar("Please fill all the details and ensure you're logged in!", { variant: "warning" });
      setIsLoading(false);
    }
  };

  const getBookingSlots = async (selectedDate) => {
    try {
      const response = await axios.get(
        `https://fsd6061we-t-node.onrender.com/getBookingSlots/${id}/${selectedDate}`
      );
      if (response?.data?.length) {
        const selectedTimes = response?.data.map((ele) => ele.selectedTime);
        setBookedTimeSlots(selectedTimes);
      }
    } catch (error) {
      console.error("Error fetching booking slots:", error);
    }
  };

  return (
    <Modal open={Boolean(modalState)} onClose={handleClose}>
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <Grid container spacing={3}>
          {/* Left side - Hotel Details */}
          <Grid item xs={12} md={6}>
            {hotelDetails && (
              <Box>
                <img
                  src={hotelDetails.image}
                  alt={hotelDetails.name}
                  style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px" }}
                />
                <Typography variant="h4" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>{hotelDetails.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn color="primary" />
                  <Typography variant="body1" sx={{ ml: 1 }}>{hotelDetails.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney color="primary" />
                  <Typography variant="h6" sx={{ ml: 1 }}>₹{hotelDetails.price}</Typography>
                  <Typography variant="body2" sx={{ ml: 1 }}>({hotelDetails.priceDetail})</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star color="primary" />
                  <Typography variant="h6" sx={{ ml: 1 }}>{hotelDetails.ratings}</Typography>
                </Box>
                <Box>
                  {hotelDetails.tags.map((tag, index) => (
                    <Chip key={index} label={tag} sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>

          {/* Right side - Booking Form */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>Make a Reservation</Typography>
            <Box sx={{ mb: 3 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Select Date"
                    onChange={handleDateChange}
                    sx={{ width: '100%' }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Select Time</Typography>
              <Grid container spacing={1}>
                {timeSlots.map((eachTime) => (
                  <Grid item key={eachTime}>
                    <Chip
                      color={bookingState.selectedTime === eachTime ? "primary" : "default"}
                      onClick={() => handleChipClick(eachTime)}
                      label={eachTime}
                      clickable
                      disabled={bookedTimeSlots.includes(eachTime)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Select Seats</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Group color="primary" />
                <Slider
                  value={bookingState.selectedSeats}
                  onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={20}
                  sx={{ ml: 2, flex: 1 }}
                />
              </Box>
            </Box>

            <LoadingButton
              loading={isLoading}
              variant="contained"
              color="primary"
              onClick={handleBooking}
              fullWidth
              size="large"
            >
              Make a Booking
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "1000px",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const timeSlots = [
  "10 AM - 11 AM",
  "11 AM - 12 PM",
  "12 PM - 1 PM",
  "1 PM - 2 PM",
  "7 PM - 8 PM",
  "8 PM - 9 PM",
  "9 PM - 10 PM",
  "10 PM - 11 PM",
];

