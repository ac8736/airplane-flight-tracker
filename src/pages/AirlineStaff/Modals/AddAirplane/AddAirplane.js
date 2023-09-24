import { styles } from "./styles";
import { Modal, Box, Typography, Input, Button } from "@mui/material";
import { useState } from "react";

export default function AddAirplane({ open, close }) {
  const [airplane, setAirplane] = useState({
    id: "",
    numOfSeats: "",
    manufacturer: "",
    age: "",
  });
  const [success, setSuccess] = useState(false);
  const [airplanesByAirline, setAirplanesByAirline] = useState([]);

  async function getAirplanes() {
    try {
      const response = await fetch("http://127.0.0.1:5000/get-airplanes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setAirplanesByAirline(data.airplanes);
    } catch (error) {
      console.log(error);
    }
  }

  async function addAirplane(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/add-airplane", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(airplane),
      });
      if (response.status !== 200) {
        const data = await response.json();
        alert(data.status);
      } else {
        setSuccess(true);
        setAirplane({
          id: "",
          numOfSeats: "",
          manufacturer: "",
          age: "",
        });
        getAirplanes();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal open={open} onClose={close}>
      {success ? (
        <Box sx={styles.modal}>
          <Typography variant="h4">
            Confirmed! <br /> Below are your airline's airplanes.
          </Typography>
          <Box sx={styles.airplaneDisplay}>
            {airplanesByAirline.map((airplane, index) => (
              <Box key={index} sx={styles.airplanes}>
                <Typography>Airplane ID: {airplane.ID}</Typography>
                <Typography>Number of Seats: {airplane.number_of_seats}</Typography>
                <Typography>Manufacturer: {airplane.manufacturing_company}</Typography>
                <Typography>Age: {airplane.age}</Typography>
              </Box>
            ))}
            <Button onClick={() => setSuccess(false)}>Add More</Button>
          </Box>
        </Box>
      ) : (
        <form onSubmit={addAirplane}>
          <Box sx={styles.modal}>
            <Typography variant="h6" component="h2">
              Add Airplane
            </Typography>
            <Input
              required
              placeholder="Airplane ID"
              value={airplane.id}
              onChange={(e) => setAirplane({ ...airplane, id: e.target.value })}
            />
            <Input
              required
              placeholder="Number of Seats"
              value={airplane.numOfSeats}
              onChange={(e) => setAirplane({ ...airplane, numOfSeats: e.target.value })}
            />
            <Input
              required
              placeholder="Manufacturing Company"
              value={airplane.manufacturer}
              onChange={(e) => setAirplane({ ...airplane, manufacturer: e.target.value })}
            />
            <Input
              required
              placeholder="Age"
              value={airplane.age}
              onChange={(e) => setAirplane({ ...airplane, age: e.target.value })}
            />
            <Button type="submit">Add Airplane</Button>
          </Box>
        </form>
      )}
    </Modal>
  );
}
