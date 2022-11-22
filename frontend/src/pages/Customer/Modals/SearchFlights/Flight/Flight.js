import { Box, Typography, Button, Modal, TextField } from "@mui/material";
import { styles } from "./styles";
import { useState } from "react";
import jwt_decode from "jwt-decode";

export default function Flight({ flightData }) {
  const [open, setOpen] = useState(false);
  const [payment, setPayment] = useState({
    email: jwt_decode(localStorage.getItem("token")).username,
    id: flightData.flight_number,
    cardNumber: "",
    purchaseDate: new Date().toISOString().slice(0, 19).replace("T", " "),
    cardType: "",
    cardName: "",
    cardExpiration: "",
  });

  async function buyFlight(e) {
    e.preventDefault();
    if (payment.cardNumber.length !== 16) {
      alert("Card number must be 16 digits.");
      return;
    }
    if (payment.cardExpiration.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/) === null) {
      alert("Card expiration must be in the format MM/YYYY and be a valid date.");
      return;
    } else {
      payment.cardExpiration = new Date(
        parseInt(payment.cardExpiration.split("/")[1]),
        parseInt(payment.cardExpiration.split("/")[0])
      )
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    }
    if (payment.cardType !== "Credit" && payment.cardType !== "Debit") {
      alert("Card type must be either Credit or Debit.");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/purchase-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payment),
      });
      if (response.status === 200) {
        alert("Purchase successful!");
        setOpen(false);
        setPayment({
          email: jwt_decode(localStorage.getItem("token")).username,
          id: flightData.flight_number,
          cardNumber: "",
          purchaseDate: new Date().toISOString().slice(0, 19).replace("T", " "),
          cardType: "",
          cardName: "",
          cardExpiration: "",
        });
      } else {
        alert("Purchase failed.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box sx={styles.container}>
      <Typography fontSize="1.2rem">Flight {flightData.flight_number}</Typography>
      <Typography fontSize="1rem">
        Status:
        <span style={flightData.flight_status === "On-time" ? { color: "green" } : { color: "red" }}>
          {flightData.flight_status}
        </span>
      </Typography>
      <Typography fontSize="1rem">Airline: {flightData.airline}</Typography>
      <Typography fontSize="1rem">Airplane: {flightData.plane_id}</Typography>
      <Typography fontSize="1rem">Price: ${flightData.base_price}</Typography>
      <Button variant="contained" sx={{ marginTop: 1 }} onClick={() => setOpen(true)}>
        Purchase
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <form onSubmit={buyFlight}>
          <Box sx={styles.modal}>
            <Typography variant="h6" component="h2" textAlign="center" marginBottom="1em">
              Purchasing Flight {flightData.flight_number}
            </Typography>
            <TextField
              required
              variant="outlined"
              label="Card Number"
              size="small"
              sx={{ marginBottom: "1em" }}
              value={payment.cardNumber}
              onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
            />
            <TextField
              required
              variant="outlined"
              label="Name on Card"
              size="small"
              sx={{ marginBottom: "1em" }}
              value={payment.cardName}
              onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
            />
            <TextField
              required
              variant="outlined"
              label="Card Type (Debit or Credit)"
              size="small"
              sx={{ marginBottom: "1em" }}
              value={payment.cardType}
              onChange={(e) => setPayment({ ...payment, cardType: e.target.value })}
            />
            <TextField
              required
              variant="outlined"
              label="Expiration Date (MM/YYYY)"
              size="small"
              sx={{ marginBottom: "1em" }}
              value={payment.cardExpiration}
              onChange={(e) => setPayment({ ...payment, cardExpiration: e.target.value })}
            />
            <Button variant="contained" type="submit">
              Purchase
            </Button>
          </Box>
        </form>
      </Modal>
    </Box>
  );
}
