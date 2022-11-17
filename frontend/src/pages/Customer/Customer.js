import { styles } from "./styles";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import jwt_decode from "jwt-decode";

export default function Customer() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({});

  useEffect(() => {
    if (!localStorage.getItem("token") || jwt_decode(localStorage.getItem("token")).role !== "customer") {
      navigate("/");
    } else {
      setCustomer(jwt_decode(localStorage.getItem("token")));
    }
  }, [navigate]);

  return (
    <div>
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
        <Button variant="contained" sx={styles.button}>
          Search for Flights
        </Button>
        <Button variant="contained" sx={styles.button}>
          Purchase Tickets
        </Button>
        <Button variant="contained" sx={styles.button}>
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
