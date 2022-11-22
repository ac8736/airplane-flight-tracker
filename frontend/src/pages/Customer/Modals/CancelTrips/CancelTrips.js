import { Box, Button, Modal, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { styles } from "./styles";

export default function CancelTrips({ open, close }) {
  const [myFlights, setMyFlights] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function getMyFlights() {
      try {
        const response = await fetch("http://127.0.0.1:5000/get-tickets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setMyFlights(data.tickets);
      } catch (error) {
        console.log(error);
      }
    }

    getMyFlights();
  }, [refresh]);

  async function cancelFlight(flightNumber) {
    try {
      const response = await fetch("http://127.0.0.1:5000/cancel-flight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ flightNumber }),
      });
      if (response.status === 200) {
        setRefresh((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h5" component="h1" textAlign="center" sx={{ mb: 2 }}>
          Cancel Trips
        </Typography>
        <Box sx={styles.flightsContainer}>
          {myFlights.length === 0 ? (
            <Box textAlign="center">
              <Typography>No flights.</Typography>
              <Button variant="contained" onClick={() => setRefresh((prev) => !prev)}>
                Refresh
              </Button>
            </Box>
          ) : (
            myFlights.map((flight, index) => (
              <Box key={index} sx={{ textAlign: "center", border: "1px solid black", p: 1 }}>
                <Typography fontSize="1.2rem">Flight {flight.flight_number}</Typography>
                <Typography>
                  Departure Date: {flight.departure_date_and_time} at Airport {flight.departure_airport}
                </Typography>
                <Typography>
                  Arrival Date: {flight.arrival_date_and_time} at Airport {flight.arrival_airport}
                </Typography>
                <Typography>Price: ${flight.sold_price}</Typography>
                <Button variant="contained" color="error" onClick={() => cancelFlight(flight.flight_number)}>
                  Cancel
                </Button>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Modal>
  );
}
