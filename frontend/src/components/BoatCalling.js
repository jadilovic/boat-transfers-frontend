import { useEffect, useState } from "react";
import "./BoatCalling.css";

/* STATIC DOCK (does not change) */
const SELECTED_DOCK = {
  lat: 44.1104865,
  lng: 15.2275032,
  name: "Zadar Old Town",
};

export default function BoatCalling() {
  const [userPosition, setUserPosition] = useState(null);
  const [distance, setDistance] = useState(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => setAllowed(false)
    );
  }, []);

  useEffect(() => {
    if (!userPosition) return;

    const dist = calculateDistance(
      userPosition.lat,
      userPosition.lng,
      SELECTED_DOCK.lat,
      SELECTED_DOCK.lng
    );

    setDistance(dist);
    setAllowed(dist <= 0.5);
  }, [userPosition]); // ✅ ESLint happy

  return (
    <section className="boat-calling">
      <h2>🚤 Boat Calling</h2>

      {!userPosition && <p>Requesting your location…</p>}

      {userPosition && !allowed && (
        <p className="error">
          You are too far from <strong>{SELECTED_DOCK.name}</strong>.
          <br />
          Move within <strong>500m</strong>.
        </p>
      )}

      {allowed && (
        <>
          <p className="success">
            You are within range ({Math.round(distance * 1000)}m)
          </p>
          <button className="primary">Call Available Boat</button>
        </>
      )}
    </section>
  );
}

/* Simple Haversine */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
