import {
  Modal,
  Box,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

export default function UserBookingModal({ handleClose, open }) {
  const [bookingData, setBookingData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { _id: userId } = userInfo;

  useEffect(() => {
    fetchBookingDetail();
  }, []);

  const fetchBookingDetail = async () => {
    try {
      if (userId) {
        const response = await axios.get(
          `http://localhost:5000/api/bookings/${userId}`
        );
        if (response?.data) {
          setBookingData(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      enqueueSnackbar("Failed to fetch booking details!", { variant: "error" });
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      if (!bookingId) {
        enqueueSnackbar("Invalid booking ID.", { variant: "error" });
        return;
      }
      const response = await axios.put(
        `http://localhost:5000/api/cancelBooking/${bookingId}`
      );
      if (response?.data?.message === "Booking cancelled successfully.") {
        enqueueSnackbar("Booking cancelled successfully!", {
          variant: "success",
        });
        fetchBookingDetail(); // Refresh the data after cancellation
      } else {
        enqueueSnackbar(response?.data?.message || "Failed to cancel booking.", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      enqueueSnackbar("Failed to cancel the booking!", { variant: "error" });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Grid>
          <Typography variant="h4">Your Booking Details</Typography>
        </Grid>

        <Grid>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell>Hotel ID</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Seats</TableCell>
                  <TableCell align="right">Time</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookingData.length > 0 ? (
                  bookingData.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell component="th" scope="row">
                        {row.hotelId}
                      </TableCell>
                      <TableCell align="right">{row.selectedDate}</TableCell>
                      <TableCell align="right">{row.selectedSeats}</TableCell>
                      <TableCell align="right">{row.selectedTime}</TableCell>
                      <TableCell align="right">
                        <Grid>
                          <Button
                            variant="contained"
                            color={row.status === "cancelled" ? "info" : "error"}
                            onClick={() => handleCancel(row._id)} // Pass the booking ID directly
                            disabled={row.status === "cancelled"}
                          >
                            {row.status === "cancelled" ? "Cancelled" : "Cancel"}
                          </Button>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
