import "./Search.css";
import { useState } from "react";
import axios from "axios";

export default function Upcoming() {
  const [dep_iata, setDepIata] = useState("");
  const [arr_iata, setArrIata] = useState("");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (dep_iata === "" && arr_iata === "") {
      setFlights([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get("https://airlabs.co/api/v9/schedules", {
        params: {
          api_key: "5262eeeb-f221-424a-b512-b003e4843840",
          dep_iata: dep_iata.toLowerCase(),
          arr_iata: arr_iata.toLowerCase(),
        },
      });
      setFlights(
        response.data.response.map((flight) => {
          return {
            flight_number: flight.flight_number,
            dep_iata: flight.dep_iata,
            arr_iata: flight.arr_iata,
            dep_estimated: flight.dep_estimated,
            arr_estimated: flight.arr_estimated,
            status: flight.status,
          };
        })
      );
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  let Flight = flights.map((flight, index) => (
    <div key={index} className="flight-card">
      <p>Flight Number: {flight.flight_number}</p>
      <p>Departure IATA: {flight.dep_iata}</p>
      <p>Arrival IATA: {flight.arr_iata}</p>
      <p>Departure Estimated: {flight.dep_estimated}</p>
      <p>Arrival Estimated: {flight.arr_estimated}</p>
      <p>Status: {flight.status}</p>
      <button>Save Flight</button>
    </div>
  ));

  return (
    <div className="upcoming">
      <h1>Search Flights</h1>
      <div>
        <div className="search-bar">
          <input type="text" placeholder="Departure IATA" value={dep_iata} onChange={(e) => setDepIata(e.target.value)} />
          <input type="text" placeholder="Arrival IATA" value={arr_iata} onChange={(e) => setArrIata(e.target.value)} />
        </div>
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="upcoming-flights">
        {flights.length === 0 && loading === false && <div className="no-flights">No flights found.</div>}
        {flights.length > 0 && loading === false && Flight}
        {loading === true && <div className="no-flights">Loading...</div>}
      </div>
    </div>
  );
}
