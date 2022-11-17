import { styles } from "./styles";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Typography, Box, Button } from "@mui/material";
import ViewFlights from "./Modals/ViewFlight/ViewFlights";
import CreateFlight from "./Modals/CreateFlight/CreateFlight";
import ChangeFlightStatus from "./Modals/ChangeFlightStatus/ChangeFlightStatus";
import AddAirplane from "./Modals/AddAirplane/AddAirplane";
import ViewFlightRatings from "./Modals/ViewFlightRatings/ViewFlightRatings";
import ViewFrequentCustomers from "./Modals/ViewFrequentCustomers/ViewFrequentCustomers";
import ViewReports from "./Modals/ViewReports/ViewReports";
import ViewRevenue from "./Modals/ViewRevenue/ViewRevenue";

export default function AirlineStaff() {
  const navigate = useNavigate();
  const [airlineStaff, setAirlineStaff] = useState({});
  const [viewFlightsOpen, setViewFlightsOpen] = useState(false);
  const [createFlightsOpen, setCreateFlightsOpen] = useState(false);
  const [changeFlightStatusOpen, setChangeFlightStatusOpen] = useState(false);
  const [addAirplaneOpen, setAddAirplaneOpen] = useState(false);
  const [viewFlightRatingsOpen, setViewFlightRatingsOpen] = useState(false);
  const [viewFrequentCustomersOpen, setViewFrequentCustomersOpen] = useState(false);
  const [viewReportsOpen, setViewReportsOpen] = useState(false);
  const [viewRevenueOpen, setViewRevenueOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token") || jwt_decode(localStorage.getItem("token")).role !== "airline-staff") {
      navigate("/");
    } else {
      setAirlineStaff(jwt_decode(localStorage.getItem("token")));
    }
  }, [navigate]);

  return (
    <div>
      <ViewFlights open={viewFlightsOpen} close={() => setViewFlightsOpen(false)} />
      <CreateFlight open={createFlightsOpen} close={() => setCreateFlightsOpen(false)} />
      <ChangeFlightStatus open={changeFlightStatusOpen} close={() => setChangeFlightStatusOpen(false)} />
      <AddAirplane open={addAirplaneOpen} close={() => setAddAirplaneOpen(false)} />
      <ViewFlightRatings open={viewFlightRatingsOpen} close={() => setViewFlightRatingsOpen(false)} />
      <ViewFrequentCustomers open={viewFrequentCustomersOpen} close={() => setViewFrequentCustomersOpen(false)} />
      <ViewReports open={viewReportsOpen} close={() => setViewReportsOpen(false)} />
      <ViewRevenue open={viewRevenueOpen} close={() => setViewRevenueOpen(false)} />
      <Box sx={styles.textContainer}>
        <Typography variant="h1" fontSize="3rem">
          Welcome, {airlineStaff.username}
        </Typography>
        <Typography fontSize="1rem">Select an option from the menu to below.</Typography>
      </Box>
      <Box sx={styles.options}>
        <Button variant="contained" sx={styles.button} onClick={() => setViewFlightsOpen(true)}>
          View Flights
        </Button>
        <Button variant="contained" sx={styles.button} onClick={() => setCreateFlightsOpen(true)}>
          Create New Flights
        </Button>
        <Button variant="contained" sx={styles.button} onClick={() => setChangeFlightStatusOpen(true)}>
          Change Status of Flights
        </Button>
        <Button variant="contained" sx={styles.button} onClick={() => setAddAirplaneOpen(true)}>
          Add Airplane in the System
        </Button>
        <Button variant="contained" sx={styles.button} onClick={() => setViewFlightRatingsOpen(true)}>
          View Flight Ratings
        </Button>
        <Button variant="contained" sx={styles.button} onClick={() => setViewFrequentCustomersOpen(true)}>
          View Frequent Customers
        </Button>
        <Button variant="contained" sx={styles.button} onClick={() => setViewReportsOpen(true)}>
          View Reports
        </Button>
        <Button variant="contained" sx={styles.button} onClick={() => setViewRevenueOpen(true)}>
          View Earned Revenue
        </Button>
      </Box>
    </div>
  );
}
