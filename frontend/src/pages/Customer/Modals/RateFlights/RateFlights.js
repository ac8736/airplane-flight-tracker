import { Box, Modal, Select, MenuItem, Typography, FormLabel, TextField, Button } from "@mui/material";
import { styles } from "./styles";
import { useState, useEffect } from "react";

export default function RateFlight({ open, close }) {
  const [flight, setFlight] = useState([]);

  const [star, setStar] = useState("");
  const [flightNum, setFlightNum] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    async function getFlight() {
      try {
        const response = await fetch("http://127.0.0.1:5000/get-tickets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setFlight(data.tickets);
      } catch (error) {
        console.log(error);
      }
    }

    getFlight();
  }, []);

  async function submitRating(e) {
    e.preventDefault();
    if (comment.length === 0) {
      alert("Please enter a comment.");
      return;
    }
    if (comment.length > 500) {
      alert("Comment is too long.");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/rate-flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          flightNum,
          star,
          comment,
        }),
      });
      if (response.status === 200) {
        alert("Rating submitted.");
        close();
      } else {
        alert("Error submitting rating.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const futureFlights = flight.filter((flight) => new Date() > new Date(flight.departure_date_and_time));

  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2" textAlign="center" mb="0.5em">
          Rate your Flights
        </Typography>
        <form onSubmit={submitRating}>
          <Box sx={styles.form}>
            <FormLabel>Select the Flight to Rate</FormLabel>
            <Select variant="standard" required value={flightNum} onChange={(e) => setFlightNum(e.target.value)}>
              {futureFlights.map((flights, index) => (
                <MenuItem value={flights.flight_number} key={index}>
                  {flights.flight_number}
                </MenuItem>
              ))}
            </Select>
            <FormLabel>Star Rating</FormLabel>
            <Select
              variant="standard"
              value={star}
              onChange={(e) => setStar(e.target.value)}
              required
              MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
            <FormLabel>Comments ({comment.length}/500)</FormLabel>
            <TextField required rows={10} multiline value={comment} onChange={(e) => setComment(e.target.value)} />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: "1em" }}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
