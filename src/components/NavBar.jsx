import {
  Grid2,
  AppBar,
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  InputAdornment,
  Input,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import HeaderSubText from "./HeaderSubText";
import RegistrationModal from "./RegistrationModal";
import BookingModal from "./UserBookingModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function NavBar({ setSearchedHotel }) {
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  const navigate = useNavigate();
  const username = localStorage.getItem("authToken");

  useEffect(() => {
    setAuthToken(localStorage.getItem("authToken")); // Update authToken state when it changes in localStorage
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("authToken"); // Remove authToken on logout
    setAuthToken(null); // Update the state to reflect logout
    window.location.reload();
  };

  return (
    <Grid2 container>
      <AppBar position="static" color="transparent">
        <Grid2
          container
          justifyContent={"center"}
          alignItems={"center"}
          gap={2}
          padding={1}
        >
          <Grid2 item>
            <Link to="/" className="logo-link">
              <img
                src="https://www.guvi.in/web-build/images/guvi-logo.8eeef9e2027d374479531095b012a87e.svg"
                alt="Guvi Logo"
                className="logo-img"
              />
            </Link>
          </Grid2>

          <Grid2 item>
            <Autocomplete
              disablePortal
              options={Locations}
              sx={{ width: 300 }}
              defaultValue={Locations.find((loc) => loc.label === "Delhi")} // Set default value to Delhi
              renderInput={(params) => <TextField {...params} label="Locations" />}
              onChange={(event, value) => {
                if (value) navigate(`/${value.label}`);
              }}
            />
          </Grid2>

          <Grid2 item>
            <FormControl variant="filled" style={{ width: 330 }}>
              <Input
                onChange={(e) => setSearchedHotel(e.target.value)}
                id="input-with-icon-adornment"
                placeholder="Search for Restaurants"
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <Button variant="contained">Search</Button>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid2>

          <Grid2 item>
            {authToken ? (
              // If authToken is present, show "My Booking" and "Sign Out"
              <Grid2 container gap={2}>
                <Button
                  variant="contained"
                  onClick={() => setBookingModalOpen(true)}
                >
                  My Booking
                </Button>
                <Button variant="contained" onClick={handleLogout}>
                  Sign Out
                </Button>
              </Grid2>
            ) : (
              // If authToken is not present, show "Sign In" and "Sign Up"
              <Grid2 container gap={2}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </Grid2>
            )}
          </Grid2>
        </Grid2>

        <HeaderSubText></HeaderSubText>
      </AppBar>

      {bookingModalOpen && (
        <BookingModal
          open={bookingModalOpen}
          handleClose={() => {
            setBookingModalOpen(false);
          }}
        ></BookingModal>
      )}
    </Grid2>
  );
}

const Locations = [
  { label: "Chennai", id: 456 },
  { label: "Delhi", id: 123 },
  { label: "Mumbai", id: 987 },
  { label: "Bengaluru", id: 123 },
];
