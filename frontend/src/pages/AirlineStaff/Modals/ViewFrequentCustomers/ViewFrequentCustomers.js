import { styles } from "./styles";
import { Modal, Box, Typography, Select, MenuItem, FormHelperText } from "@mui/material";
import { useState, useEffect } from "react";

export default function ViewFrequentCustomers({ open, close }) {
  const [customers, setCustomers] = useState([]);
  const [mostFrequent, setMostFrequent] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState("");

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
        console.log(data);
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

  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          View Frequent Customers
        </Typography>
        <Typography>Most Frequent Customer in the Past Year: {mostFrequent}</Typography>
        <FormHelperText>Select a customer to view.</FormHelperText>
        <Select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
          sx={{ width: "100%" }}
        >
          {customers.map((customer) => (
            <MenuItem value={customer.customer_email}>{customer.customer_email}</MenuItem>
          ))}
        </Select>
        {selectedCustomer && <Box>Selected Customer: {selectedCustomer}</Box>}
      </Box>
    </Modal>
  );
}
