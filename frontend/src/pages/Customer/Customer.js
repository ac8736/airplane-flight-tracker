import { styles } from "./styles";
import { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import jwt_decode from "jwt-decode";

const SearchFlights = lazy(() => import("./Modals/SearchFlights/SearchFlights"));
const CancelTrips = lazy(() => import("./Modals/CancelTrips/CancelTrips"));
const TrackSpending = lazy(() => import("./Modals/TrackSpending/TrackSpending"));
const ViewFlights = lazy(() => import("./Modals/ViewFlights/ViewFlights"));
const RateFlights = lazy(() => import("./Modals/RateFlights/RateFlights"));

export default function Customer() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({});

  const [searchFlightsOpen, setSearchFlightsOpen] = useState(false);
  const [cancelTripsOpen, setCancelTripsOpen] = useState(false);
  const [trackSpendingOpen, setTrackSpendingOpen] = useState(false);
  const [viewFlightsOpen, setViewFlightsOpen] = useState(false);
  const [rateFlightsOpen, setRateFlightsOpen] = useState(false);

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("token") || jwt_decode(sessionStorage.getItem("token")).role !== "customer") {
      navigate("/");
    } else {
      setCustomer(jwt_decode(sessionStorage.getItem("token")));
    }
  }, [navigate]);

  return (
    <div>
      <SearchFlights
        open={searchFlightsOpen}
        close={() => setSearchFlightsOpen(false)}
        update={() => setRefresh((prev) => !prev)}
      />
      <CancelTrips open={cancelTripsOpen} close={() => setCancelTripsOpen(false)} update={() => setRefresh((prev) => !prev)} />
      <TrackSpending open={trackSpendingOpen} close={() => setTrackSpendingOpen(false)} />
      <ViewFlights open={viewFlightsOpen} close={() => setViewFlightsOpen(false)} />
      <RateFlights open={rateFlightsOpen} close={() => setRateFlightsOpen(false)} />
      <Box sx={styles.textContainer}>
        <Typography variant="h1" fontSize="3rem">
          Welcome, {customer.email}
        </Typography>
        <Typography fontSize="1rem">Select an option from the menu to below.</Typography>
      </Box>
      <Box sx={styles.options}>
        <Button variant="contained" sx={styles.button} onClick={() => setViewFlightsOpen(true)}>
          View My Flights
        </Button>
        <Button variant="contained" sx={styles.button} onClick={() => setSearchFlightsOpen(true)}>
          Search for Flights
        </Button>
        <Button variant="contained" sx={styles.button} onClick={() => setCancelTripsOpen(true)}>
          Cancel Trips
        </Button>
        <Button variant="contained" sx={styles.button} onClick={() => setRateFlightsOpen(true)}>
          Rate and Comment on Flights
        </Button>
        <Button variant="contained" sx={styles.button} onClick={() => setTrackSpendingOpen(true)}>
          Track my Spending
        </Button>
      </Box>
    </div>
  );
}
