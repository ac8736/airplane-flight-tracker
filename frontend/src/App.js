import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Logout from "./pages/Logout/Logout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const SignIn = lazy(() => import("./pages/SignIn/SignIn"));
const Customer = lazy(() => import("./pages/Customer/Customer"));
const AirlineStaff = lazy(() => import("./pages/AirlineStaff/AirlineStaff"));

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<div></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/airline-staff" element={<AirlineStaff />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
