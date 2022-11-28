import { Box, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { styles } from "./styles";

export default function TrackSpending({ open, close }) {
  const [spending, setSpending] = useState([]);

  useEffect(() => {
    async function getSpending() {
      try {
        const response = await fetch("http://127.0.0.1:5000/track-spending", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setSpending(data.purchases);
      } catch (error) {
        console.log(error);
      }
    }

    getSpending();
  }, [open]);

  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          Track my Spending
        </Typography>
        <Box sx={styles.spendingContainer}>
          {spending.length === 0 ? (
            <Typography>No purchases found.</Typography>
          ) : (
            <Box>
              <Typography variant="h6" component="h2">
                Total Spent: ${spending[0].total}
              </Typography>
              {spending.map((purchase, index) => (
                <Box sx={styles.spendingCard} key={index}>
                  <Typography>Ticket ID: {purchase.ticket_id}</Typography>
                  <Typography>Price: ${purchase.sold_price}</Typography>
                  <Typography>Date: {purchase.purchase_date_and_time}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
