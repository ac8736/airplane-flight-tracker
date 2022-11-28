import { Button, Box, Input, Typography } from "@mui/material";
import { useState } from "react";
import { styles } from "./styles";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isCustomer, setIsCustomer] = useState(true);
  const [customer, setCustomer] = useState({ email: "", password: "" });
  const [airline, setAirline] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        isCustomer ? "http://127.0.0.1:5000/login-customer" : "http://127.0.0.1:5000/login-airline-staff",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(isCustomer ? customer : airline),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        sessionStorage.setItem("token", data.token);
        navigate(isCustomer ? "/customer" : "/airline-staff");
      } else {
        alert(data.status);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={login}>
      <Box sx={styles.formContainer}>
        <Box>
          <Typography fontSize="2.4rem">Log In</Typography>
          <Typography fontSize="1.1rem">{isCustomer ? "Customer" : "Airline Staff"}</Typography>
        </Box>
        {!isCustomer ? (
          <Box sx={styles.inputs}>
            <Input
              placeholder="Username"
              required
              onChange={(e) => setAirline({ ...airline, username: e.target.value })}
              value={airline.username}
            />
            <Input
              placeholder="Password"
              required
              onChange={(e) => setAirline({ ...airline, password: e.target.value })}
              value={airline.password}
              type="password"
            />
          </Box>
        ) : (
          <Box sx={styles.inputs}>
            <Input
              placeholder="Email"
              required
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              value={customer.email}
            />
            <Input
              placeholder="Password"
              required
              onChange={(e) => setCustomer({ ...customer, password: e.target.value })}
              value={customer.password}
              type="password"
            />
          </Box>
        )}
        <Box>
          <Button variant="contained" sx={styles.button} type="submit">
            Login
          </Button>
          <Button sx={{ textTransform: "none", marginLeft: "19px" }} onClick={() => setIsCustomer((prev) => !prev)}>
            {isCustomer ? "Are you airline staff?" : "Are you a customer?"}
          </Button>
        </Box>
      </Box>
    </form>
  );
}
