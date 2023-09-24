import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home-title-text">
        <h1>View All Flights, Future or Past From One Place</h1>
        <p>A convenient place to quickly check flights.</p>
      </div>
      <div className="home-buttons">
        <div className="home-buttons-card" onClick={() => navigate("/upcoming")}>
          <h2>Upcoming Flights</h2>
          <p>Search for any upcoming flights.</p>
        </div>
        <div className="home-buttons-card" onClick={() => navigate("/past")}>
          <h2>Past Flights</h2>
          <p>Search for any upcoming flights.</p>
        </div>
        <div className="home-buttons-card" onClick={() => navigate("/saved")}>
          <h2>Saved Flights</h2>
          <p>Look at your saved flights.</p>
        </div>
      </div>
    </div>
  );
}
