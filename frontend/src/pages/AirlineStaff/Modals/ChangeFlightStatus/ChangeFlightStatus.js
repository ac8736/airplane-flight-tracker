import { Modal, Box, Typography } from "@mui/material";
import { styles } from "./styles";

export default function ChangeFlightStatus({ open, close }) {
  return (
    <Modal open={open} onClose={close}>
      <Box sx={styles.modal}>
        <Typography variant="h6" component="h2">
          Change Flight Status
        </Typography>
        <Typography sx={{ mt: 2 }}>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</Typography>
      </Box>
    </Modal>
  );
}
