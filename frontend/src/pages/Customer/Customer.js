import { styles } from "./styles";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export default function Customer() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({});

  useEffect(() => {
    if (!localStorage.getItem("token") || jwt_decode(localStorage.getItem("token")).role !== "customer") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <h1>Customer</h1>
    </div>
  );
}
