import { styles } from "./styles";
import {
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function ViewFrequentCustomers({ open, close }) {
  const [customers, setCustomers] = useState([]);
  const [mostFrequent, setMostFrequent] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerFlights, setSelectedCustomerFlights] = useState([]);

  useEffect(() => {
    async function getCustomers() {
      try {
        const response = await fetch("http://127.0.0.1:5000/customer-reports", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          setCustomers(data.customers_by_airline);
          setMostFrequent(data.most_frequent_customer.customer_email);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getCustomers();
  }, []);

  useEffect(() => {
    async function getCustomerFlights() {
      if (selectedCustomer === "") return;
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/customer-flights/${selectedCustomer}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setSelectedCustomerFlights(data.customer_flights);
      } catch (error) {
        console.log(error);
      }
    }

    getCustomerFlights();
  }, [selectedCustomer]);

  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          View Frequent Customers
        </Typography>
        <Typography>
          Most Frequent Customer in the Past Year:{" "}
          {mostFrequent ? mostFrequent : "No customers yet."}
        </Typography>
        <FormHelperText>Select a customer to view.</FormHelperText>
        <Select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
          sx={styles.selectBox}
        >
          {customers.map((customer) => (
            <MenuItem
              key={customer.customer_email}
              value={customer.customer_email}
            >
              {customer.customer_email}
            </MenuItem>
          ))}
        </Select>
        {selectedCustomer && (
          <Box>
            <Typography margin="1em 0">
              Selected Customer: {selectedCustomer}
            </Typography>
            <Box sx={styles.previousFlightsContainer}>
              {selectedCustomerFlights.map((flight, index) => (
                <Box key={index} sx={styles.flightContainer}>
                  <Typography variant="h6" component="h2">
                    Flight Number: {flight.flight_number}
                    <br />
                    Departure Date-Time: {flight.departure_date_and_time} <br />
                    Departure Airport: {flight.departure_airport}
                    <br />
                    Arrival Date-Time: {flight.arrival_date_and_time}
                    <br />
                    Arrival Airport: {flight.arrival_airport}
                    <br />
                    Base Price: {flight.base_price}
                    <br />
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
