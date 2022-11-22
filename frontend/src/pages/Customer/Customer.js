import { styles } from "./styles";
import { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import jwt_decode from "jwt-decode";

const SearchFlights = lazy(() => import("./Modals/SearchFlights/SearchFlights"));
const CancelTrips = lazy(() => import("./Modals/CancelTrips/CancelTrips"));

export default function Customer() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({});

  const [searchFlightsOpen, setSearchFlightsOpen] = useState(false);
  const [cancelTripsOpen, setCancelTripsOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token") || jwt_decode(localStorage.getItem("token")).role !== "customer") {
      navigate("/");
    } else {
      setCustomer(jwt_decode(localStorage.getItem("token")));
    }
  }, [navigate]);

  return (
    <div>
      <SearchFlights open={searchFlightsOpen} close={() => setSearchFlightsOpen(false)} />
      <CancelTrips open={cancelTripsOpen} close={() => setCancelTripsOpen(false)} />
      <Box sx={styles.textContainer}>
        <Typography variant="h1" fontSize="3rem">
          Welcome, {customer.username}
        </Typography>
        <Typography fontSize="1rem">Select an option from the menu to below.</Typography>
      </Box>
      <Box sx={styles.options}>
        <Button variant="contained" sx={styles.button}>
          View My Flights
        </Button>
        <Button variant="contained" sx={styles.button} onClick={() => setSearchFlightsOpen(true)}>
          Search for Flights
        </Button>
        <Button variant="contained" sx={styles.button} onClick={() => setCancelTripsOpen(true)}>
          Cancel Trips
        </Button>
        <Button variant="contained" sx={styles.button}>
          Rate and Comment on Flights
        </Button>
        <Button variant="contained" sx={styles.button}>
          Track my Spending
        </Button>
      </Box>
    </div>
  );
}
