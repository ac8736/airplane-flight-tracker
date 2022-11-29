import { styles } from "./styles";
import { Modal, Box, Typography, Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";

export default function ViewFlightRatings({ open, close }) {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState("");
  const [selectedFlightRatings, setSelectedFlightRatings] = useState([]);

  useEffect(() => {
    async function getFlights() {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/flights-by-airline",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setFlights(data.flights);
      } catch (error) {
        console.log(error);
      }
    }

    getFlights();
  }, []);

  useEffect(() => {
    async function getFlightRatings() {
      if (selectedFlight === "") return;
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/get-flight-ratings/${selectedFlight}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setSelectedFlightRatings(data.flight_ratings);
      } catch (error) {
        console.log(error);
      }
    }

    getFlightRatings();
  }, [selectedFlight]);

  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          View Flight Ratings
        </Typography>
        <Typography>Select the flight to view.</Typography>
        <Select
          sx={{ width: "100%" }}
          MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
          value={selectedFlight}
          onChange={(e) => setSelectedFlight(e.target.value)}
        >
          {flights.map((flight, index) => (
            <MenuItem key={index} value={flight.flight_number}>
              {flight.flight_number}
            </MenuItem>
          ))}
        </Select>
        <Box sx={styles.ratingContainer}>
          {selectedFlightRatings.map((rating, index) => (
            <Box key={index} sx={styles.rating}>
              <Typography>
                Flight: {rating.flight_number} <br />
                Rating: {rating.rating} / 5 <br />
                Comment: {rating.comments} <br />
                From: {rating.email}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Modal>
  );
}
