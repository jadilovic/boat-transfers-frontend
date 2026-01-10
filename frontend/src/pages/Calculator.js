import { useState, useEffect, useCallback, useMemo } from "react";
import Layout from "../components/Layout";
import DockMap from "../components/DockMap";
import "./Calculator.css";

// Helper: calculate distance between two coordinates (km)
const getDistance = (lat1, lon1, lat2, lon2) => {
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
};

// Helper: calculate base fare
const calculateBasePrice = (km) => Math.max(25 + km * 3.2, 40);

export default function Calculator() {

  const docks = useMemo(() => [
    { name: "Zadar Port (Old Town)", lat: 44.1104865172623, lng: 15.227503253176431 },
    { name: "Zadar Gazenica Port", lat: 44.0924, lng: 15.2624 },
    { name: "Marina Zadar (Tankerkomerc)", lat: 44.1192, lng: 15.2277 },
    { name: "Uvala Fosa (Small Harbor)", lat: 44.11215, lng: 15.22823 },
    { name: "Zaton Tourist Village Marina", lat: 44.2303, lng: 15.1618 },
    { name: "Preko Port (Ugljan)", lat: 44.07553, lng: 15.19479 },
    { name: "Kukljica Marina (Ugljan)", lat: 44.0342, lng: 15.2498 },
    { name: "Brbinj (Iž Island)", lat: 44.08195, lng: 14.99381 },
    { name: "Sali Port (Dugi Otok)", lat: 43.93694, lng: 15.16878 },
    { name: "Marina Veli Iž (Iž Island)", lat: 44.05202, lng: 15.11062 }
  ], []); // empty dependency array → docks is stable

  const [fromDock, setFromDock] = useState("");
  const [toDock, setToDock] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [distance, setDistance] = useState(null);
  const [price, setPrice] = useState(null);
  const [error, setError] = useState("");

  const calculatePrice = useCallback(() => {
    if (!fromDock || !toDock) {
      setError("Please select both departure and destination docks.");
      setDistance(null);
      setPrice(null);
      return;
    }

    if (fromDock === toDock) {
      setError("Departure and destination cannot be the same.");
      setDistance(null);
      setPrice(null);
      return;
    }

    if (passengers < 1) {
      setError("At least one passenger is required.");
      setDistance(null);
      setPrice(null);
      return;
    }

    setError("");

    const start = docks.find((d) => d.name === fromDock);
    const end = docks.find((d) => d.name === toDock);

    const km = getDistance(start.lat, start.lng, end.lat, end.lng);
    setDistance(km);

    const basePrice = calculateBasePrice(km);
    const passengerPrice = passengers * 10;
    const totalPrice = basePrice + passengerPrice;

    setPrice({
      base: basePrice.toFixed(2),
      passengers: passengerPrice.toFixed(2),
      total: totalPrice.toFixed(2),
    });
  }, [fromDock, toDock, passengers, docks]);


  // Automatic recalculation when inputs change
  useEffect(() => {
    if (fromDock && toDock && passengers >= 1) {
      calculatePrice();
    } else {
      setDistance(null);
      setPrice(null);
    }
  }, [fromDock, toDock, passengers, calculatePrice]);

  return (
    <Layout>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2>Trip Price Calculator</h2>
        <p>Select your route and passengers to estimate price:</p>

        <div className="calc-box">
          <div className="input-row">
            <div className="field">
              <label>From</label>
              <select value={fromDock} onChange={(e) => setFromDock(e.target.value)}>
                <option value="">Select dock</option>
                {docks.map((d) => (
                  <option key={d.name} value={d.name} disabled={d.name === toDock}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>To</label>
              <select value={toDock} onChange={(e) => setToDock(e.target.value)}>
                <option value="">Select dock</option>
                {docks.map((d) => (
                  <option key={d.name} value={d.name} disabled={d.name === fromDock}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Passengers</label>

              <div className="passenger-control">
                <button
                  type="button"
                  onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                  disabled={passengers <= 1}
                >
                  −
                </button>

                <input
                  type="text"
                  className="passenger-input"
                  value={passengers}
                  readOnly
                />

                <button
                  type="button"
                  onClick={() => setPassengers((p) => Math.min(10, p + 1))}
                  disabled={passengers >= 10}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button className="calc-btn" onClick={calculatePrice}>
            Calculate
          </button>

          {error && <p className="error">{error}</p>}

          {distance && price && (
            <div className="result">
              <div className="result-row">
                <span>Distance</span>
                <strong>{distance} km</strong>
              </div>

              <div className="result-row">
                <span>Base fare</span>
                <strong>€{price.base}</strong>
              </div>

              <div className="result-row">
                <span>Passengers ({passengers})</span>
                <strong>€{price.passengers}</strong>
              </div>

              <div className="result-total">
                <span>Total</span>
                <strong>€{price.total}</strong>
              </div>
            </div>
          )}
          {!fromDock && !toDock && (
            <p className="map-hint">
              📍 Select a dock to display it on the map.
            </p>
          )}

          {(fromDock || toDock) && !fromDock !== !toDock && (
            <p className="map-hint">
              📍 Select the second dock to display the full distance.
            </p>
          )}
          {(fromDock || toDock) && (
            <DockMap docks={docks} fromDock={fromDock} toDock={toDock} />
          )}
        </div>
      </div>
    </Layout>
  );
}
