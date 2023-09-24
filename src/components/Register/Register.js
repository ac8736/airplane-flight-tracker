import { Box, Button, Select, TextField, Typography, MenuItem, FormHelperText, FormControl } from "@mui/material";
import { styles } from "./styles";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [isCustomer, setIsCustomer] = useState(true);
  const [airlineStaff, setAirlineStaff] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    dob: "",
    airline: "",
  });
  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    password: "",
    dob: "",
    phoneNumber: "",
    buildingNumber: "",
    street: "",
    city: "",
    state: "",
    passportNumber: "",
    passportExpiration: "",
    passportCountry: "",
  });
  const [airlineVerifyPwd, setAirlineVerifyPwd] = useState("");
  const [customerVerifyPwd, setCustomerVerifyPwd] = useState("");
  const [airlineVerifyPwdError, setAirlineVerifyPwdError] = useState(false);
  const [customerVerifyPwdError, setCustomerVerifyPwdError] = useState(false);
  const [airlines, setAirlines] = useState([]);

  useEffect(() => {
    async function getAirlines() {
      try {
        const response = await fetch("http://127.0.0.1:5000/get-airlines");
        const data = await response.json();
        setAirlines(data.airlines);
      } catch (error) {
        console.error(error);
      }
    }

    getAirlines();
  }, []);

  async function register(e) {
    e.preventDefault();
    if (isCustomer) {
      if (customer.password !== customerVerifyPwd) {
        setCustomerVerifyPwdError(true);
        return;
      }
    } else {
      if (airlineStaff.password !== airlineVerifyPwd) {
        setAirlineVerifyPwdError(true);
        return;
      }
    }
    try {
      const response = await fetch(
        !isCustomer ? "http://127.0.0.1:5000/register-airline-staff" : "http://127.0.0.1:5000/register-customer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(!isCustomer ? airlineStaff : customer),
        }
      );
      const data = await response.json();
      if (response.status === 409) {
        alert(data.status);
        return;
      } else {
        sessionStorage.setItem("token", data.token);
        navigate(isCustomer ? "/customer" : "/airline-staff");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={register}>
      <Box sx={styles.formContainer}>
        <Box>
          <Typography fontSize="2.4rem">Register</Typography>
          <Typography fontSize="1.1rem">{isCustomer ? "Customer" : "Airline Staff"}</Typography>
        </Box>
        {isCustomer ? (
          <>
            <Box sx={styles.inputs}>
              <TextField
                placeholder="Full Name"
                onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                value={customer.fullName}
                required
                variant="standard"
              />
              <TextField
                placeholder="Email"
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                value={customer.email}
                required
                variant="standard"
                type="email"
              />
              <TextField
                placeholder="Password"
                onChange={(e) => setCustomer({ ...customer, password: e.target.value })}
                value={customer.password}
                required
                variant="standard"
                type="password"
              />
              <TextField
                placeholder="Verify Password"
                onChange={(e) => setCustomerVerifyPwd(e.target.value)}
                value={customerVerifyPwd}
                required
                variant="standard"
                type="password"
                error={customerVerifyPwdError}
                helperText={customerVerifyPwdError ? "Passwords do not match" : ""}
              />
              <TextField
                placeholder="Date of Birth (YYYY-MM-DD)"
                onChange={(e) => setCustomer({ ...customer, dob: e.target.value })}
                value={customer.dob}
                required
                variant="standard"
              />
              <TextField
                placeholder="Phone Number (XXX-XXX-XXXX)"
                onChange={(e) => setCustomer({ ...customer, phoneNumber: e.target.value })}
                value={customer.phoneNumber}
                required
                variant="standard"
              />
            </Box>
            <Box sx={styles.inputs}>
              <TextField
                placeholder="Building Number"
                onChange={(e) => setCustomer({ ...customer, buildingNumber: e.target.value })}
                value={customer.buildingNumber}
                required
                variant="standard"
              />
              <TextField
                placeholder="Street"
                onChange={(e) => setCustomer({ ...customer, street: e.target.value })}
                value={customer.street}
                required
                variant="standard"
              />
              <TextField
                placeholder="City"
                onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                value={customer.city}
                required
                variant="standard"
              />
              <TextField
                placeholder="State"
                onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                value={customer.state}
                required
                variant="standard"
              />
            </Box>
            <Box sx={styles.inputs}>
              <TextField
                placeholder="Passport Number"
                onChange={(e) => setCustomer({ ...customer, passportNumber: e.target.value })}
                value={customer.passportNumber}
                required
                variant="standard"
              />
              <TextField
                placeholder="Passport Expiration (YYYY-MM-DD)"
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    passportExpiration: e.target.value,
                  })
                }
                value={customer.passportExpiration}
                required
                variant="standard"
              />
              <TextField
                placeholder="Passport Country"
                onChange={(e) => setCustomer({ ...customer, passportCountry: e.target.value })}
                value={customer.passportCountry}
                required
                variant="standard"
              />
            </Box>
          </>
        ) : (
          <Box sx={styles.inputs}>
            <TextField
              placeholder="Username"
              onChange={(e) => setAirlineStaff({ ...airlineStaff, username: e.target.value })}
              value={airlineStaff.username}
              required
              variant="standard"
            />
            <TextField
              placeholder="First Name"
              onChange={(e) => setAirlineStaff({ ...airlineStaff, firstName: e.target.value })}
              value={airlineStaff.firstName}
              required
              variant="standard"
            />
            <TextField
              placeholder="Last Name"
              onChange={(e) => setAirlineStaff({ ...airlineStaff, lastName: e.target.value })}
              value={airlineStaff.lastName}
              required
              variant="standard"
            />
            <TextField
              placeholder="Password"
              onChange={(e) => setAirlineStaff({ ...airlineStaff, password: e.target.value })}
              value={airlineStaff.password}
              required
              variant="standard"
              type="password"
            />
            <TextField
              placeholder="Verify Password"
              onChange={(e) => setAirlineVerifyPwd(e.target.value)}
              value={airlineVerifyPwd}
              required
              variant="standard"
              error={airlineVerifyPwdError}
              helperText={airlineVerifyPwdError ? "Passwords do not match" : ""}
              type="password"
            />
            <TextField
              placeholder="Date of Birth (YYYY-MM-DD)"
              onChange={(e) => setAirlineStaff({ ...airlineStaff, dob: e.target.value })}
              value={airlineStaff.dob}
              required
              variant="standard"
            />
            <FormControl sx={{ width: "50%" }}>
              <FormHelperText>Select your airline.</FormHelperText>
              <Select
                variant="standard"
                required
                value={airlineStaff.airline}
                onChange={(e) => setAirlineStaff({ ...airlineStaff, airline: e.target.value })}
                MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
              >
                {airlines.map((airline) => (
                  <MenuItem key={airline.name} value={airline.name}>
                    {airline.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        <Box>
          <Button type="submit" variant="contained" sx={styles.button}>
            Register
          </Button>
          <Button sx={{ textTransform: "none", marginLeft: "19px" }} onClick={() => setIsCustomer((prev) => !prev)}>
            {isCustomer ? "Are you airline staff?" : "Are you a customer?"}
          </Button>
        </Box>
      </Box>
    </form>
  );
}
