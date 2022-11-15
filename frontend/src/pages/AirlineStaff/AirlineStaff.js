import { styles } from "./styles";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AirlineStaff() {
  const navigate = useNavigate();
  const [airlineStaff, setAirlineStaff] = useState({});

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("http://127.0.0.1:5000/get-session");
        if (response.status === 404) navigate("/");
        const data = await response.json();
        if (data.session.includes("@")) navigate("/");
        setAirlineStaff(data.session);
      } catch (error) {
        console.log(error);
      }
    }

    checkSession();
  }, [navigate]);

  return (
    <div>
      <h1>Airline Staff</h1>
    </div>
  );
}
