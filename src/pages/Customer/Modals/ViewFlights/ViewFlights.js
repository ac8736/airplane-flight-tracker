import { Modal, Box, Typography } from "@mui/material";
import { styles } from "./styles";
import { useState, useEffect } from "react";

export default function ViewFlights({ open, close }) {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    async function getTickets() {
      try {
        const response = await fetch("http://127.0.0.1:5000/get-tickets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setFlights(data.tickets);
      } catch (error) {
        console.log(error);
      }
    }

    getTickets();
  }, []);

  const futureFlights = flights.filter((flight) => new Date() < new Date(flight.departure_date_and_time));

  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          View Future Flights
        </Typography>
        <Box sx={styles.flightsContainer}>
          {futureFlights.map((flight, index) => (
            <Box key={index} sx={styles.flight}>
              <Typography>Flight Number: {flight.flight_number}</Typography>
              <Typography>Departure Airport: {flight.departure_airport}</Typography>
              <Typography>Arrival Airport: {flight.arrival_airport}</Typography>
              <Typography>
                Departure Date and Time: <br />
                {flight.departure_date_and_time}
              </Typography>
              <Typography>
                Arrival Date and Time: <br /> {flight.arrival_date_and_time}
              </Typography>
              <Typography>Airline: {flight.airline}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Modal>
  );
}
