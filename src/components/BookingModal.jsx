import {
  Modal,
  Box,
  Typography,
  Grid2,
  Slider,
  Chip,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

export default function BookingModal({ handleClose, modalState }) {
  const { id, location } = modalState || {};  // Destructure to get hotelId and location passed to the modal
  const { enqueueSnackbar } = useSnackbar();
  const username = localStorage.getItem("username");

  // State for booking details
  const [bookingState, setBookingState] = useState({
    selectedTime: "",
    selectedDate: "",
    selectedSeats: 0,
  });

  // State for hotel details
  const [hotelDetails, setHotelDetails] = useState(null);

  // State for booked time slots
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch hotel details when modal is opened
  useEffect(() => {
    if (id && location) {
      setBookingState({
        selectedTime: "",
        selectedDate: "",
        selectedSeats: 0,
      });
      getHotelDetails(location, id);  // Fetch hotel details by city and ID
    }
  }, [id, location]);

  // Function to fetch hotel details based on location and ID
  const getHotelDetails = async (city, hotelId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/restaurants/${city}/${hotelId}`);
      const data = response.data;

      if (data) {
        setHotelDetails(data);  // Set the hotel details in state
      } else {
        enqueueSnackbar("Hotel not found!", { variant: "error" });
      }
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      enqueueSnackbar("Error fetching hotel details!", { variant: "error" });
    }
  };

  const handleSliderChange = (event) => {
    setBookingState({
      ...bookingState,
      selectedSeats: event.target.value,
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
    if (username && id && selectedDate && selectedTime && selectedSeats) {
      try {
        const response = await axios.post(
          "https://fsd6061we-t-node.onrender.com/create-booking",
          {
            username,
            hotelId: id,
            selectedDate,
            selectedTime,
            selectedSeats,
          }
        );
        if (response.data === "Booking created") {
          setBookingState({
            selectedTime: "",
            selectedDate: "",
            selectedSeats: 0,
          });
          handleClose();
          enqueueSnackbar("Booking Created successfully!", { variant: "success" });
        }
      } catch (error) {
        enqueueSnackbar("Error creating booking!", { variant: "error" });
      } finally {
        setIsLoading(false);
      }
    } else {
      enqueueSnackbar("Please fill all the details!", { variant: "warning" });
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
        <Grid2
          container
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {/* Display Hotel Details */}
          {hotelDetails && (
            <Grid2 width="100%" textAlign="center">
              <Typography variant="h5">{hotelDetails.name}</Typography>
              <Typography variant="body1">{hotelDetails.location}</Typography>
              <Typography variant="h6">Price: ₹{hotelDetails.price}</Typography>
              <Typography variant="body2">{hotelDetails.priceDetail}</Typography>
              <Typography variant="h6">Rating: {hotelDetails.ratings}</Typography>
              <img
                src={hotelDetails.image}
                alt={hotelDetails.name}
                style={{ width: "100%", height: "auto", marginBottom: "1rem" }}
              />
              <Typography variant="body2">
                Tags: {hotelDetails.tags.join(", ")}
              </Typography>
            </Grid2>
          )}

          <Grid2 width="60%" textAlign="center">
            <Typography variant="h6">Select Seats</Typography>
            <Slider
              defaultValue={0}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={20}
              onChange={handleSliderChange}
            />
          </Grid2>

          <Grid2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker onChange={handleDateChange} label="Select Date" />
              </DemoContainer>
            </LocalizationProvider>
          </Grid2>

          <Grid2
            container
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h6">Select Time</Typography>
            <Grid2
              paddingLeft={4}
              paddingRight={4}
              container
              justifyContent="center"
              alignItems="center"
            >
              {timeSlots.map((eachTime) => (
                <Grid2 key={eachTime}>
                  <Chip
                    color={bookingState.selectedTime === eachTime ? "success" : "default"}
                    onClick={() => handleChipClick(eachTime)}
                    label={eachTime}
                    clickable
                    disabled={bookedTimeSlots.includes(eachTime)}
                  />
                </Grid2>
              ))}
            </Grid2>
          </Grid2>

          <Grid2 paddingBottom={4}>
            <LoadingButton
              loading={isLoading}
              variant="contained"
              color="primary"
              onClick={handleBooking}
            >
              Make a Booking
            </LoadingButton>
          </Grid2>
        </Grid2>
      </Box>
    </Modal>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
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
