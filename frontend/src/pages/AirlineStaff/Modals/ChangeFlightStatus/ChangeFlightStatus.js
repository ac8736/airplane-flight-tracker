import { Modal, Box, Typography, Input, Button } from "@mui/material";
import { styles } from "./styles";
import { useState } from "react";

export default function ChangeFlightStatus({ open, close, flights, update }) {
  const [search, setSearch] = useState("");
  const filteredFlights = flights.filter((flight) => flight.flight_number.toString().includes(search));

  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          Change Flight Status
        </Typography>
        <Input placeholder="Search by Flight Number" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Box sx={{ height: "50vh", overflow: "auto", p: 1 }}>
          {filteredFlights.map((flight, index) => (
            <Box
              key={index}
              sx={{ border: "1px solid black", p: 2, marginBottom: "1em", display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Typography>Flight Number: {flight.flight_number}</Typography>
              <Typography>
                Flight Status:
                <span style={flight.flight_status === "On-time" ? { color: "green" } : { color: "red" }}>
                  {flight.flight_status}
                </span>
              </Typography>
              <Typography>Departure Time: {flight.departure_date_and_time}</Typography>
              <Typography>Arrival Time: {flight.arrival_date_and_time}</Typography>
              <Button
                variant="contained"
                sx={{ width: "58%", margin: "auto" }}
                onClick={async () => {
                  try {
                    await fetch("http://127.0.0.1:5000/change-flight-status", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: JSON.stringify({
                        flightNumber: flight.flight_number,
                        status: flight.flight_status === "On-time" ? "Delayed" : "On-time",
                      }),
                    });
                    update();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                {flight.flight_status === "On-time" ? "Set Flight Delayed" : "Set Flight On-time"}
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Modal>
  );
}
