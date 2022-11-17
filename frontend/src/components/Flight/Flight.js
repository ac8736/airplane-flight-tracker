import { Typography, Box, CardContent } from "@mui/material";
import { styles } from "./styles";

export default function Flight({ airline, arrivalAirPort, arrivalTime, basePrice, departureAirPort, departureTime, flightNum }) {
  return (
    <Box sx={styles.card}>
      <CardContent sx={{ gap: "1em", display: "flex", flexDirection: "column" }}>
        <Box sx={styles.group}>
          <Typography fontSize="1.3rem" fontWeight="bold">
            Airline: {airline}
          </Typography>
          <Typography fontWeight="bold">Flight Number: {flightNum}</Typography>
        </Box>
        <Box sx={styles.group}>
          <Typography fontWeight="bold">Departure Airport: {departureAirPort}</Typography>
          <Typography fontWeight="bold">Departure Time: {departureTime}</Typography>
        </Box>
        <Box sx={styles.group}>
          <Typography fontWeight="bold">Arrival Airport: {arrivalAirPort}</Typography>
          <Typography fontWeight="bold">Arrival Time: {arrivalTime}</Typography>
        </Box>
        <Box sx={styles.group}>
          <Typography fontWeight="bold">Base Price: ${basePrice}</Typography>
        </Box>
      </CardContent>
    </Box>
  );
}
