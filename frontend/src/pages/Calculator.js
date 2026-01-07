import { useState } from "react";
import Layout from "../components/Layout";


export default function Calculator() {
  const docks = [
    { name: "Zadar Port (Old Town)", lat: 44.12149, lng: 15.22143 },
    { name: "Zadar Gazenica Port", lat: 44.0924, lng: 15.2624 },
    { name: "Marina Zadar (Tankerkomerc)", lat: 44.1192, lng: 15.2277 },
    { name: "Uvala Fosa (Small Harbor)", lat: 44.11215, lng: 15.22823 },
    { name: "Zaton Tourist Village Marina", lat: 44.2303, lng: 15.1618 },
    { name: "Preko Port (Ugljan)", lat: 44.07553, lng: 15.19479 },
    { name: "Kukljica Marina (Ugljan)", lat: 44.0342, lng: 15.2498 },
    { name: "Brbinj (Iž Island)", lat: 44.08195, lng: 14.99381 },
    { name: "Sali Port (Dugi Otok)", lat: 43.93694, lng: 15.16878 },
    { name: "Marina Veli Iž (Iž Island)", lat: 44.05202, lng: 15.11062 }
  ];

  const [fromDock, setFromDock] = useState("");
  const [toDock, setToDock] = useState("");
  const [distance, setDistance] = useState(null);
  const [price, setPrice] = useState(null);
  const [error, setError] = useState("");

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return +(R * c).toFixed(2);
  }

  function calculatePrice(km) {
    const BASE = 25;
    const PER_KM = 3.2;
    const MIN = 40;

    const total = BASE + km * PER_KM;
    return Math.max(total, MIN).toFixed(2);
  }

  function handleCalculate() {
    setError("");
    setDistance(null);
    setPrice(null);

    if (!fromDock || !toDock) {
      setError("Please select both docks.");
      return;
    }

    if (fromDock === toDock) {
      setError("Departure and destination cannot be the same.");
      return;
    }

    const start = docks.find((d) => d.name === fromDock);
    const end = docks.find((d) => d.name === toDock);

    const km = getDistance(start.lat, start.lng, end.lat, end.lng);
    setDistance(km);

    const tripPrice = calculatePrice(km);
    setPrice(tripPrice);
  }

  return (
    <Layout>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2>Trip Price Calculator</h2>
        <p>Select your route to estimate distance and price:</p>

        <div className="calc-box">
          <div className="input-row">
            <div>
              <label>From</label>
              <select
                value={fromDock}
                onChange={(e) => setFromDock(e.target.value)}
              >
                <option value="">Select dock</option>
                {docks.map((d) => (
                  <option
                    key={d.name}
                    value={d.name}
                    disabled={d.name === toDock}
                  >
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>To</label>
              <select
                value={toDock}
                onChange={(e) => setToDock(e.target.value)}
              >
                <option value="">Select dock</option>
                {docks.map((d) => (
                  <option
                    key={d.name}
                    value={d.name}
                    disabled={d.name === fromDock}
                  >
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="calc-btn" onClick={handleCalculate}>
            Calculate
          </button>

          {error && <p className="error">{error}</p>}

          {distance && (
            <div className="result">
              <p>Distance: <strong>{distance} km</strong></p>
              <p>Estimated Price: <strong>€{price}</strong></p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
