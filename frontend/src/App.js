import "./App.css";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import SignIn from "./pages/SignIn/SignIn";
import Customer from "./pages/Customer/Customer";
import AirlineStaff from "./pages/AirlineStaff/AirlineStaff";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/airline-staff" element={<AirlineStaff />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
