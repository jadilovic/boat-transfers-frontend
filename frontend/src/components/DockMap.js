import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useMemo, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Marker icon fix */
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* Haversine distance (km) */
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return +(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
};

/* Auto-fit + zoom logic */
function FitBounds({ from, to }) {
  const map = useMap();

  useEffect(() => {
    if (from && to) {
      const bounds = L.latLngBounds(
        [from.lat, from.lng],
        [to.lat, to.lng]
      );
      map.fitBounds(bounds, {
        padding: [60, 60],
        animate: true,
      });
    }
  }, [from, to, map]);

  return null;
}

export default function DockMap({ docks, fromDock, toDock }) {
  const from = useMemo(
    () => docks.find((d) => d.name === fromDock),
    [docks, fromDock]
  );

  const to = useMemo(
    () => docks.find((d) => d.name === toDock),
    [docks, toDock]
  );

  const center = useMemo(() => {
    if (from && to)
      return [(from.lat + to.lat) / 2, (from.lng + to.lng) / 2];
    if (from) return [from.lat, from.lng];
    if (to) return [to.lat, to.lng];
    return null;
  }, [from, to]);

  const distance =
    from && to ? getDistance(from.lat, from.lng, to.lat, to.lng) : null;

  // 🔴 Only hide map if NO docks selected
  if (!center) return null;

  return (
    <div style={{ marginTop: 24, position: "relative" }}>
      {/* Distance badge */}
      {distance && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            background: "white",
            padding: "6px 12px",
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
          }}
        >
          Distance: {distance} km
        </div>
      )}

      <MapContainer
        center={center}
        zoom={from && to ? 10 : 12}
        style={{
          height: 320,
          width: "100%",
          borderRadius: 14,
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds from={from} to={to} />

        {from && (
          <Marker position={[from.lat, from.lng]} icon={markerIcon}>
            <Popup>
              <strong>From</strong>
              <br />
              {from.name}
            </Popup>
          </Marker>
        )}

        {to && (
          <Marker position={[to.lat, to.lng]} icon={markerIcon}>
            <Popup>
              <strong>To</strong>
              <br />
              {to.name}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
