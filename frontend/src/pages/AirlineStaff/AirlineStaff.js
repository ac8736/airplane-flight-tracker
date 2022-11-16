import { styles } from "./styles";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export default function AirlineStaff() {
  const navigate = useNavigate();
  const [airlineStaff, setAirlineStaff] = useState({});

  useEffect(() => {
    if (!localStorage.getItem("token") || jwt_decode(localStorage.getItem("token")).role !== "airline-staff") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <h1>Airline Staff</h1>
    </div>
  );
}
