import Flight from "../../components/Flight/Flight";
import { useState, useEffect } from "react";
import { styles } from "./styles";
import { Typography, Input, CircularProgress, Box } from "@mui/material";
import jwt_decode from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [search, setSearch] = useState({
    departureAirPort: "",
    arrivalAirPort: "",
    departureDate: "",
    arrivalDate: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAllFlights() {
      try {
        if (sessionStorage.getItem("token")) {
          if (jwt_decode(sessionStorage.getItem("token")).role === "airline-staff") {
            navigate("/airline-staff");
          }
          if (jwt_decode(sessionStorage.getItem("token")).role === "customer") {
            navigate("/customer");
          }
        }
        const response = await fetch("http://127.0.0.1:5000/all-flights");
        const data = await response.json();
        setFlights(data.flights);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    getAllFlights();
  }, [location, navigate]);

  const searchedFlights = flights.filter(
    (flight) =>
      flight.departure_airport.toLowerCase().includes(search.departureAirPort.toLowerCase()) &&
      flight.arrival_airport.toLowerCase().includes(search.arrivalAirPort.toLowerCase()) &&
      flight.departure_date_and_time.toLowerCase().includes(search.departureDate.toLowerCase()) &&
      flight.arrival_date_and_time.toLowerCase().includes(search.arrivalDate.toLowerCase())
  );
  const flightsList = searchedFlights.map((flight, index) => (
    <Flight
      key={index}
      airline={flight.airline}
      arrivalAirPort={flight.arrival_airport}
      arrivalTime={flight.arrival_date_and_time}
      basePrice={flight.base_price}
      departureAirPort={flight.departure_airport}
      departureTime={flight.departure_date_and_time}
      flightNum={flight.flight_number}
      flightStatus={flight.flight_status}
    />
  ));

  return (
    <Box sx={styles.home}>
      <Box sx={styles.filter}>
        <Typography fontSize="3rem">Filter By</Typography>
        <Input
          placeholder="Departure Airport"
          onChange={(e) => setSearch({ ...search, departureAirPort: e.target.value })}
          value={search.departureAirPort}
        />
        <Input
          placeholder="Departure Date (Ex: Sat, 05 Dec 2021 00:00:00 GMT)"
          onChange={(e) => setSearch({ ...search, departureDate: e.target.value })}
          value={search.departureDate}
        />
        <Input
          placeholder="Arrival Airport"
          onChange={(e) => setSearch({ ...search, arrivalAirPort: e.target.value })}
          value={search.arrivalAirPort}
        />
        <Input
          placeholder="Arrival Date (Ex: Sat, 05 Dec 2021 00:00:00 GMT)"
          onChange={(e) => setSearch({ ...search, arrivalDate: e.target.value })}
          value={search.arrivalDate}
        />
      </Box>
      <Box>
        <Typography align="center" fontSize="3rem" fontWeight="bold">
          Flights
        </Typography>
        <Box sx={styles.container}>
          {!loading ? (
            flightsList.length === 0 ? (
              <Typography>No available flights.</Typography>
            ) : (
              flightsList
            )
          ) : (
            <CircularProgress size="10rem" />
          )}
        </Box>
      </Box>
    </Box>
  );
}
