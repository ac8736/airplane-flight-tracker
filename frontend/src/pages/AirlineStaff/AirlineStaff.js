import { styles } from "./styles";
import { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Typography, Box, Button } from "@mui/material";
import ViewFlights from "./Modals/ViewFlight/ViewFlights";

const CreateFlight = lazy(() => import("./Modals/CreateFlight/CreateFlight"));
const ChangeFlightStatus = lazy(() => import("./Modals/ChangeFlightStatus/ChangeFlightStatus"));
const AddAirplane = lazy(() => import("./Modals/AddAirplane/AddAirplane"));
const ViewFlightRatings = lazy(() => import("./Modals/ViewFlightRatings/ViewFlightRatings"));
const ViewFrequentCustomers = lazy(() => import("./Modals/ViewFrequentCustomers/ViewFrequentCustomers"));
const ViewReports = lazy(() => import("./Modals/ViewReports/ViewReports"));
const ViewRevenue = lazy(() => import("./Modals/ViewRevenue/ViewRevenue"));
const AddAirport = lazy(() => import("./Modals/AddAirport/AddAirport"));

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
  const [addAirportOpen, setAddAirportOpen] = useState(false);

  const [flights, setFlights] = useState([]);
  const [planeIds, setPlaneIds] = useState([]);
  const [airports, setAirports] = useState([]);

  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("token") || jwt_decode(sessionStorage.getItem("token")).role !== "airline-staff") {
      navigate("/");
    } else {
      setAirlineStaff(jwt_decode(sessionStorage.getItem("token")));
    }

    async function getFlights() {
      try {
        const response = await fetch("http://127.0.0.1:5000/flights-by-airline", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setFlights(data.flights);
      } catch (error) {
        console.error(error);
      }
    }

    async function getPlanesAndAirports() {
      try {
        const response = await fetch("http://127.0.0.1:5000/get-airplanes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setPlaneIds(data.airplanes);
        const response2 = await fetch("http://127.0.0.1:5000/get-airports");
        const data2 = await response2.json();
        setAirports(data2.airports);
      } catch (error) {
        console.error(error);
      }
    }
    getPlanesAndAirports();
    getFlights();
  }, [navigate, update]);

  return (
    <div>
      <ViewFlights open={viewFlightsOpen} close={() => setViewFlightsOpen(false)} />
      <CreateFlight
        open={createFlightsOpen}
        close={() => setCreateFlightsOpen(false)}
        planeIds={planeIds}
        airports={airports}
        update={() => setUpdate((prev) => !prev)}
      />
      <ChangeFlightStatus
        open={changeFlightStatusOpen}
        close={() => setChangeFlightStatusOpen(false)}
        flights={flights}
        update={() => setUpdate((prev) => !prev)}
      />
      <AddAirplane open={addAirplaneOpen} close={() => setAddAirplaneOpen(false)} />
      <ViewFlightRatings open={viewFlightRatingsOpen} close={() => setViewFlightRatingsOpen(false)} />
      <ViewFrequentCustomers open={viewFrequentCustomersOpen} close={() => setViewFrequentCustomersOpen(false)} />
      <ViewReports open={viewReportsOpen} close={() => setViewReportsOpen(false)} />
      <ViewRevenue open={viewRevenueOpen} close={() => setViewRevenueOpen(false)} />
      <AddAirport open={addAirportOpen} close={() => setAddAirportOpen(false)} />
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
        <Button variant="contained" sx={styles.button} onClick={() => setAddAirportOpen(true)}>
          Add Airport in the System
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
