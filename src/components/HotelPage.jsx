import { useState, useEffect } from "react";
import { Grid2 } from "@mui/material";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Filter from "./Filter";
import HotelCards from "./HotelCards";
import { useParams } from "react-router-dom";

export default function HotelPage({ searchedHotel }) {
  const [sort, setSort] = useState("Rating");
  const [selectedTags, setSelectedTags] = useState([]);
  const [restaurant, setRestaurant] = useState([]); // Added state for restaurant data
  const { location } = useParams(); // Extract location from URL

  // Fetch the restaurant data from the API based on the location
  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!location) return;

      try {
        // Fetch data for the specific location
        const response = await fetch(`http://localhost:5000/api/restaurants/${location}`);
        const data = await response.json();
        setRestaurant(data); // Set the fetched data to the restaurant state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRestaurants();
  }, [location]); // Run this effect whenever location changes

  const handleFilterChange = (event) => {
    if (selectedTags.find((ele) => ele === event.target.value)) {
      const updatedTags = selectedTags.filter((ele) => ele !== event.target.value);
      setSelectedTags(updatedTags);
    } else {
      setSelectedTags([...selectedTags, event.target.value]);
    }
  };

  return (
    <Grid2 container display={"flex"} flexDirection={"row"} gap={2} width={"100%"} marginTop={1}>
      <Grid2 width={"20%"}>
        <Filter handleFilterChange={handleFilterChange} />
      </Grid2>
      <Grid2 container direction={"column"} spacing={2} width={"75%"}>
        <Grid2 container>
          <Grid2>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link underline="hover" color="inherit">
                {location}
              </Link>
              <Typography sx={{ color: "text.primary" }}>
                {location} Location
              </Typography>
            </Breadcrumbs>
          </Grid2>
        </Grid2>

        <Grid2 container justifyContent={"space-between"} alignItems={"center"}>
          <Grid2>Best Restaurants Near Me in {location}(8483)</Grid2>

          <Grid2 container justifyContent={"center"} alignItems={"center"} flexDirection={"row"} width={"50%"}>
            <Grid2>Sort by</Grid2>

            <Grid2 width={"30%"}>
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sort}
                  label="Sort"
                  onChange={(event) => {
                    setSort(event.target.value);
                  }}
                >
                  {sortByData.map((element) => {
                    return (
                      <MenuItem key={element.value} value={element.value}>
                        {element.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid2>
          </Grid2>
        </Grid2>

        <Grid2 container>
          <HotelCards selectedTags={selectedTags} sort={sort} hotelData={restaurant} searchedHotel={searchedHotel}></HotelCards>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

const sortByData = [
  { value: "Rating", name: "Rating" },
  { value: "Price High To Low", name: "Price High To Low" },
  { value: "Price Low To High", name: "Price Low To High" },
];
