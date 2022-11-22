import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { useNavigate, useLocation } from "react-router-dom";
import { styles } from "./styles";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  function logOut() {
    localStorage.clear();
    navigate("/logout");
  }

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
            {(location.pathname === "/" ||
              location.pathname === "/logout" ||
              location.pathname === "/sign-in") && (
              <Button
                variant="text"
                sx={styles.button}
                onClick={() => navigate("/")}
              >
                Home
              </Button>
            )}
            {!(
              location.pathname === "/customer" ||
              location.pathname === "/airline-staff"
            ) ? (
              <Button
                variant="text"
                sx={styles.button}
                onClick={() => navigate("/sign-in")}
              >
                Sign In
              </Button>
            ) : (
              <Button variant="text" sx={styles.button} onClick={logOut}>
                Log out
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
