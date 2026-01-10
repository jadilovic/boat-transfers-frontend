import { useEffect, useState } from "react";
import "./BoatCalling.css";


export default function BoatCalling({ selectedDock }) {
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
      () => {
        setAllowed(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!userPosition || !selectedDock) return;

    const dist = calculateDistance(
      userPosition.lat,
      userPosition.lng,
      selectedDock.lat,
      selectedDock.lng
    );

    setDistance(dist);
    setAllowed(dist <= 0.5); // km = 500m
  }, [userPosition, selectedDock]);

  return (
    <section className="boat-calling">
      <h2>🚤 Boat Calling</h2>

      {!selectedDock && (
        <p>Please select a pickup dock to continue.</p>
      )}

      {selectedDock && !allowed && (
        <p className="error">
          You are too far from this dock.
          <br />
          Move within <strong>500m</strong> to call a boat.
        </p>
      )}

      {selectedDock && allowed && (
        <>
          <p className="success">
            You are within range ({Math.round(distance * 1000)}m)
          </p>
          <button className="primary">
            Call Available Boat
          </button>
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
