import { Box, Button } from "@mui/material";
import { styles } from "./styles";
import Register from "../../components/Register/Register";
import Login from "../../components/Login/Login";
import { useState } from "react";

export default function SignIn() {
  const [isRegister, setIsRegister] = useState(true);

  return (
    <Box sx={styles.container}>
      {isRegister ? <Register /> : <Login />}
      <Button sx={{ textTransform: "none", width: "50%", marginLeft: "25%" }} onClick={() => setIsRegister((prev) => !prev)}>
        {isRegister ? "Already have an account?" : "Don't have an account?"}
      </Button>
    </Box>
  );
}
