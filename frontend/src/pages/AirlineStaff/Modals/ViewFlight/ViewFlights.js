import { Modal, Typography, Box } from "@mui/material";
import { styles } from "./styles";

export default function ViewFlights({ open, close }) {
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
