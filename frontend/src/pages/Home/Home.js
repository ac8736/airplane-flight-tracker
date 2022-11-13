import Box from "@mui/material/Box";
import Flight from "../../components/Flight/Flight";
import { useState, useEffect } from "react";
import { styles } from "./styles";
import { Typography, Input } from "@mui/material";

export default function Home() {
  const [flights, setFlights] = useState([]);
  const [search, setSearch] = useState({
    departureAirPort: "",
    arrivalAirPort: "",
    departureDate: "",
    arrivalDate: "",
  });

  useEffect(() => {
    async function getAllFlights() {
      try {
        const response = await fetch("http://127.0.0.1:5000/all-flights");
        const data = await response.json();
        setFlights(data.flights);
      } catch (error) {
        console.error(error);
      }
    }

    getAllFlights();
  }, []);

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
        <Box sx={styles.container}>{flightsList}</Box>
      </Box>
    </Box>
  );
}
