import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { useNavigate } from "react-router-dom";
import { styles } from "./styles";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={styles.appbar}>
      <Container maxWidth="fluid">
        <Toolbar disableGutters sx={styles.toolbar}>
          <Box sx={styles.logo}>
            <FlightTakeoffIcon fontSize="large" />
            <Typography variant="h5" fontSize="1.5rem">
              AirTickets
            </Typography>
          </Box>
          <Box sx={styles.navOptions}>
            <Button variant="text" sx={styles.button} onClick={() => navigate("/")}>
              Home
            </Button>
            <Button variant="text" sx={styles.button} onClick={() => navigate("/sign-in")}>
              Sign In
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
