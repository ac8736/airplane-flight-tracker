import { Button, Box, Input, Typography } from "@mui/material";
import { useState } from "react";
import { styles } from "./styles";

export default function Login() {
  const [isCustomer, setIsCustomer] = useState(true);

  return (
    <Box sx={styles.formContainer}>
      <Box>
        <Typography fontSize="2.4rem">Log In</Typography>
        <Typography fontSize="1.1rem">{isCustomer ? "Customer" : "Airline Staff"}</Typography>
      </Box>
      {!isCustomer ? (
        <>
          <Box sx={styles.inputs}>
            <Input placeholder="Username" />
            <Input placeholder="Password" />
          </Box>
        </>
      ) : (
        <>
          <Box sx={styles.inputs}>
            <Input placeholder="Email" />
            <Input placeholder="Password" />
          </Box>
        </>
      )}
      <Box>
        <Button variant="contained" sx={styles.button}>
          Login
        </Button>
        <Button sx={{ textTransform: "none", marginLeft: "19px" }} onClick={() => setIsCustomer((prev) => !prev)}>
          {isCustomer ? "Are you airline staff?" : "Are you a customer?"}
        </Button>
      </Box>
    </Box>
  );
}
