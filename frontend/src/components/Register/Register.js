import { Box, Button, Input, Typography } from "@mui/material";
import { styles } from "./styles";
import { useState } from "react";

export default function Register() {
  const [isCustomer, setIsCustomer] = useState(true);

  return (
    <Box sx={styles.formContainer}>
      <Box>
        <Typography fontSize="2.4rem">Register</Typography>
        <Typography fontSize="1.1rem">{isCustomer ? "Customer" : "Airline Staff"}</Typography>
      </Box>
      {isCustomer ? (
        <>
          <Box sx={styles.inputs}>
            <Input placeholder="Full Name" />
            <Input placeholder="Email" />
            <Input placeholder="Password" />
            <Input placeholder="Verify Password" />
            <Input placeholder="Date of Birth" />
            <Input placeholder="Phone Number" />
          </Box>
          <Box sx={styles.inputs}>
            <Input placeholder="Building Number" />
            <Input placeholder="Street" />
            <Input placeholder="City" />
            <Input placeholder="State" />
          </Box>
          <Box sx={styles.inputs}>
            <Input placeholder="Passport Number" />
            <Input placeholder="Passport Expiration" />
            <Input placeholder="Passport Country" />
          </Box>
        </>
      ) : (
        <>
          <Box sx={styles.inputs}>
            <Input placeholder="Username" />
            <Input placeholder="First Name" />
            <Input placeholder="Last Name" />
            <Input placeholder="Password" />
            <Input placeholder="Verify Password" />
            <Input placeholder="Date of Birth" />
            <Input placeholder="Airline" />
          </Box>
        </>
      )}

      <Box>
        <Button variant="contained" sx={styles.button}>
          Register
        </Button>
        <Button sx={{ textTransform: "none", marginLeft: "19px" }} onClick={() => setIsCustomer((prev) => !prev)}>
          {isCustomer ? "Are you airline staff?" : "Are you a customer?"}
        </Button>
      </Box>
    </Box>
  );
}
