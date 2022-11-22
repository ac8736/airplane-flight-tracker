import { styles } from "./styles";
import { Box, Modal, Button, Typography, FormLabel, Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Flight from "./Flight/Flight";

export default function SearchFlights({ open, close }) {
  const [search, setSearch] = useState({ departureAirport: "", arrivalAirport: "", departureDate: "", arrivalDate: "" });
  const [departureDateTime, setDepartureDateTime] = useState(new Date());
  const [arrivalDateTime, setArrivalDateTime] = useState(new Date());
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    async function getFlights() {
      try {
        const response = await fetch("http://127.0.0.1:5000/all-flights");
        const data = await response.json();
        setFlights(data.flights);
      } catch (error) {
        console.log(error);
      }
    }
    async function getAirports() {
      try {
        const response = await fetch("http://127.0.0.1:5000/get-airports");
        const data = await response.json();
        setAirports(data.airports);
      } catch (error) {
        console.log(error);
      }
    }

    getFlights();
    getAirports();
  }, []);

  async function searchFlights() {
    search.departureDate = departureDateTime.toISOString().slice(0, 19).replace("T", " ");
    search.arrivalDate = arrivalDateTime.toISOString().slice(0, 19).replace("T", " ");
    try {
      const response = await fetch("http://127.0.0.1:5000/search-flight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(search),
      });
      const data = await response.json();
      setFlights(data.flights);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          Search For Flights
        </Typography>
        <FormLabel>Select the departure airport.</FormLabel>
        <Select
          required
          variant="standard"
          MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
          value={search.departureAirport}
          onChange={(e) => setSearch({ ...search, departureAirport: e.target.value })}
        >
          {airports.map((airport, index) => (
            <MenuItem key={index} value={airport.name}>
              {airport.airport_type} {airport.name} at {airport.city}, {airport.country}
            </MenuItem>
          ))}
        </Select>
        <FormLabel>Select the departure airport.</FormLabel>
        <Select
          required
          variant="standard"
          MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
          value={search.arrivalAirport}
          onChange={(e) => setSearch({ ...search, arrivalAirport: e.target.value })}
        >
          {airports.map((airport, index) => (
            <MenuItem key={index} value={airport.name}>
              {airport.airport_type} {airport.name} at {airport.city}, {airport.country}
            </MenuItem>
          ))}
        </Select>
        <FormLabel>Departure Date and Time</FormLabel>
        <DatePicker showTimeSelect selected={departureDateTime} onChange={(date) => setDepartureDateTime(date)} />
        <FormLabel>Arrival Date and Time</FormLabel>
        <DatePicker showTimeSelect selected={arrivalDateTime} onChange={(date) => setArrivalDateTime(date)} />
        <Button variant="contained" onClick={searchFlights}>
          Search
        </Button>
        <Box sx={styles.flightsContainer}>
          {flights.length > 0 ? (
            flights.map((flight, index) => <Flight key={index} flightData={flight} />)
          ) : (
            <Typography>No flights.</Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
