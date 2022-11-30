import { Modal, Typography, Box } from "@mui/material";
import { styles } from "./styles";
import { useState, useEffect } from "react";

export default function ViewFlights({ open, close }) {
  useEffect(() => {}, []);

  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          View Flights
        </Typography>
      </Box>
    </Modal>
  );
}
