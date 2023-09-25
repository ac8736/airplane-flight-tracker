import "./Navbar.css";
import Logo from "../../assets/plane-icon.png";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav>
      <div className="navbar">
        <div className="navbar-tabs">
          <div className="navbar-logo" onClick={() => navigate("/")}>
            <img src={Logo} alt="plane logo" />
            <h1 className="navbar-title">
              Air<span>Stats</span>
            </h1>
          </div>
          <Link to="/search" className="navbar-link">
            Search
          </Link>
          <Link to="/saved" className="navbar-link">
            Saved
          </Link>
        </div>
        <div className="navbar-logins">
          <Link to="/login" className="navbar-link">
            Login
          </Link>
          <Link to="/signup" className="navbar-link-button">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
