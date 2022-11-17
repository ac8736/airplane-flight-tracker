import { styles } from "./styles";
import { Modal, Box, Typography } from "@mui/material";

export default function ViewFlightRatings({ open, close }) {
  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          View Flight Ratings
        </Typography>
        <Typography sx={{ mt: 2 }}>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</Typography>
      </Box>
    </Modal>
  );
}
