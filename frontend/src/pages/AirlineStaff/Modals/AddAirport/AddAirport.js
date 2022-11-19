import { Modal, Box, Typography, Button, Input } from "@mui/material";
import { styles } from "./styles";
import { useState } from "react";

export default function AddAirport({ open, close }) {
  const [airport, setAirport] = useState({
    name: "",
    city: "",
    country: "",
    airportType: "",
  });

  async function addAirport(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/add-airport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(airport),
      });
      if (response.status !== 200) {
        const data = await response.json();
        alert(data.status);
      } else {
        alert("Airport added successfully!");
        setAirport({
          name: "",
          city: "",
          country: "",
          airportType: "",
        });
        close();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal open={open} onClose={close}>
      <form onSubmit={addAirport}>
        <Box sx={styles.modal}>
          <Typography variant="h6" component="h2">
            Add Airport
          </Typography>
          <Input
            required
            placeholder="Airport Name"
            value={airport.name}
            onChange={(e) => setAirport({ ...airport, name: e.target.value })}
          />
          <Input
            required
            placeholder="Airport City"
            value={airport.city}
            onChange={(e) => setAirport({ ...airport, city: e.target.value })}
          />
          <Input
            required
            placeholder="Airport Country"
            value={airport.country}
            onChange={(e) => setAirport({ ...airport, country: e.target.value })}
          />
          <Input
            required
            placeholder="Airport Type"
            value={airport.airportType}
            onChange={(e) => setAirport({ ...airport, airportType: e.target.value })}
          />
          <Button type="submit">Add Airport</Button>
        </Box>
      </form>
    </Modal>
  );
}
