import { styles } from "./styles";
import { Modal, Box, Typography, Input, FormLabel, Button, Select, MenuItem, FormHelperText } from "@mui/material";
import DatePicker from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateFlights({ open, close, planeIds, airports, update }) {
  const [flight, setFlight] = useState({
    flightNumber: "",
    departureAirport: "",
    departureDateTime: "",
    arrivalAirport: "",
    arrivalDateTime: "",
    basePrice: "",
    plane: "",
  });
  const [departureDateTime, setDepartureDateTime] = useState(new Date());
  const [arrivalDateTime, setArrivalDateTime] = useState(new Date());

  async function addFlight(e) {
    e.preventDefault();
    flight.departureDateTime = departureDateTime.toISOString().slice(0, 19).replace("T", " ");
    flight.arrivalDateTime = arrivalDateTime.toISOString().slice(0, 19).replace("T", " ");
    if (departureDateTime > arrivalDateTime) {
      alert("Departure date must be before arrival date.");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/add-flight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(flight),
      });
      if (response.status !== 200) {
        const data = await response.json();
        alert(data.status);
      } else {
        alert("Flight added successfully!");
        setFlight({
          flightNumber: "",
          departureAirport: "",
          departureDateTime: "",
          arrivalAirport: "",
          arrivalDateTime: "",
          basePrice: "",
          plane: "",
        });
        close();
        update();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal open={open} onClose={close}>
      <form onSubmit={addFlight}>
        <Box sx={styles.modal}>
          <Typography variant="h6" component="h2">
            Create Flight
          </Typography>
          <Input
            required
            placeholder="Flight Number"
            value={flight.flightNumber}
            onChange={(e) => setFlight({ ...flight, flightNumber: e.target.value })}
          />
          <FormHelperText>Select the departure airport.</FormHelperText>
          <Select
            required
            variant="standard"
            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
            value={flight.departureAirport}
            onChange={(e) => setFlight({ ...flight, departureAirport: e.target.value })}
          >
            {airports.map((airport, index) => (
              <MenuItem key={index} value={airport.name}>
                {airport.airport_type} {airport.name} at {airport.city}, {airport.country}
              </MenuItem>
            ))}
          </Select>
          <FormLabel>Departure Date and Time</FormLabel>
          <DatePicker showTimeSelect selected={departureDateTime} onChange={(date) => setDepartureDateTime(date)} />
          <FormHelperText>Select the arrival airport.</FormHelperText>
          <Select
            required
            variant="standard"
            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
            value={flight.arrivalAirport}
            onChange={(e) => setFlight({ ...flight, arrivalAirport: e.target.value })}
          >
            {airports.map((airport, index) => (
              <MenuItem key={index} value={airport.name}>
                {airport.airport_type} {airport.name} at {airport.city}, {airport.country}
              </MenuItem>
            ))}
          </Select>
          <FormLabel>Arrival Date and Time</FormLabel>
          <DatePicker showTimeSelect selected={arrivalDateTime} onChange={(date) => setArrivalDateTime(date)} />
          <Input
            required
            placeholder="Base Price"
            value={flight.basePrice}
            onChange={(e) => setFlight({ ...flight, basePrice: e.target.value })}
          />
          <FormHelperText>Select the airplane.</FormHelperText>
          <Select
            required
            variant="standard"
            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
            value={flight.plane}
            onChange={(e) => setFlight({ ...flight, plane: e.target.value })}
          >
            {planeIds.map((planeId, index) => (
              <MenuItem key={index} value={planeId.ID}>
                Plane {planeId.ID} with {planeId.number_of_seats} seats
              </MenuItem>
            ))}
          </Select>
          <Button type="submit">Create Flight</Button>
        </Box>
      </form>
    </Modal>
  );
}
