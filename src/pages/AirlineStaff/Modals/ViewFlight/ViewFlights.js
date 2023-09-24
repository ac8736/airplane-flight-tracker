import { Modal, Typography, Box, Input, Checkbox, FormLabel } from "@mui/material";
import { styles } from "./styles";
import { useState, useEffect } from "react";
import Flight from "../../../../components/Flight/Flight";

export default function ViewFlights({ open, close }) {
  const [flights, setFlights] = useState([]);

  const [search, setSearch] = useState({
    departureAirPort: "",
    arrivalAirPort: "",
    departureDate: "",
    arrivalDate: "",
  });

  const [viewOld, setViewOld] = useState(false);

  useEffect(() => {
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
        const filteredFlights = data.flights.filter((flight) => {
          if (viewOld) {
            return true;
          }
          const msBetweenDates = new Date(flight.departure_date_and_time).getTime() - new Date().getTime();
          return msBetweenDates / (24 * 60 * 60 * 1000) >= 0 && msBetweenDates / (24 * 60 * 60 * 1000) <= 30;
        });
        if (response.status === 200) {
          setFlights(filteredFlights);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getFlights();
  }, [open, viewOld]);

  const searchedFlights = flights.filter(
    (flight) =>
      flight.departure_airport.toLowerCase().includes(search.departureAirPort.toLowerCase()) &&
      flight.arrival_airport.toLowerCase().includes(search.arrivalAirPort.toLowerCase()) &&
      flight.departure_date_and_time.toLowerCase().includes(search.departureDate.toLowerCase()) &&
      flight.arrival_date_and_time.toLowerCase().includes(search.arrivalDate.toLowerCase())
  );

  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          View Flights
        </Typography>
        <Box sx={styles.filter}>
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
          <FormLabel>View Old Flights</FormLabel>
          <Checkbox value={viewOld} onChange={() => setViewOld((prev) => !prev)} />
        </Box>
        <Box sx={styles.flightsContainers}>
          {searchedFlights.map((flight, index) => (
            <Flight
              airline={flight.airline}
              arrivalAirPort={flight.arrival_airport}
              arrivalTime={flight.arrival_date_and_time}
              basePrice={flight.base_price}
              departureTime={flight.departure_date_and_time}
              flightNum={flight.flight_number}
              flightStatus={flight.flight_status}
              departureAirPort={flight.departure_airport}
              hasModal
              key={index}
            />
          ))}
        </Box>
      </Box>
    </Modal>
  );
}
