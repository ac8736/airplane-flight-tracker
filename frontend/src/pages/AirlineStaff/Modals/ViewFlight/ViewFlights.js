import { Modal, Typography, Box } from "@mui/material";
import { styles } from "./styles";
import { useState, useEffect } from "react";

export default function ViewFlights({ open, close }) {
  useEffect(() => {
    console.log("ViewFlights mounted");
  }, []);

  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          Text in a modal
        </Typography>
        <Typography sx={{ mt: 2 }}>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</Typography>
      </Box>
    </Modal>
  );
}
