import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar/Navbar";
import Footer from "./component/Footer/Footer";
import Home from "./pages/Home/Home";
import Upcoming from "./pages/Upcoming/Upcoming";
// import { lazy, Suspense } from "react";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
