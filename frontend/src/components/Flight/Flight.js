import { Typography, Box, CardContent, Modal, Button } from "@mui/material";
import { styles } from "./styles";
import { useState } from "react";

export default function Flight({
  airline,
  arrivalAirPort,
  arrivalTime,
  basePrice,
  departureAirPort,
  departureTime,
  flightNum,
  flightStatus,
  hasModal,
}) {
  const [flightsDetails, setFlightsDetails] = useState([]);
  const [nestedModal, setNestedModal] = useState(false);

  async function getFlightDetails(flight_number) {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/get-flight-customers/${flight_number}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        setFlightsDetails(data.flight_customers);
        setNestedModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box sx={styles.card}>
      <Modal open={nestedModal} onClose={() => setNestedModal(false)}>
        <Box sx={styles.modal}>
          <Typography>Flight Customers</Typography>
          {flightsDetails.length !== 0 ? (
            flightsDetails.map((flight, index) => (
              <Box key={index} sx={{ border: "1px solid black" }}>
                <Typography>
                  Ticket ID: {flight.ID} <br /> Customer:{" "}
                  {flight.customer_email}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No customers on this flight.</Typography>
          )}
        </Box>
      </Modal>
      <CardContent
        sx={{ gap: "1em", display: "flex", flexDirection: "column" }}
      >
        <Box sx={styles.group}>
          <Typography fontSize="1.3rem" fontWeight="bold">
            Airline: {airline}
          </Typography>
          <Typography fontWeight="bold">Flight Number: {flightNum}</Typography>
        </Box>
        <Box sx={styles.group}>
          <Typography fontWeight="bold">
            Departure Airport: {departureAirPort}
          </Typography>
          <Typography fontWeight="bold">
            Departure Time: {departureTime}
          </Typography>
        </Box>
        <Box sx={styles.group}>
          <Typography fontWeight="bold">
            Arrival Airport: {arrivalAirPort}
          </Typography>
          <Typography fontWeight="bold">Arrival Time: {arrivalTime}</Typography>
        </Box>
        <Box sx={styles.group}>
          <Typography fontWeight="bold">Base Price: ${basePrice}</Typography>
          <Typography fontWeight="bold">
            Flight Status:{" "}
            <span
              style={{ color: flightStatus === "On-time" ? "green" : "red" }}
            >
              {flightStatus}
            </span>
          </Typography>
        </Box>
        {hasModal && (
          <Button
            variant="contained"
            onClick={() => getFlightDetails(flightNum)}
          >
            See Details
          </Button>
        )}
      </CardContent>
    </Box>
  );
}
