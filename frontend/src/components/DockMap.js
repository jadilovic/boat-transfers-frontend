import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Helper component to move map center dynamically
function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
}

export default function DockMap({ fromDock, toDock, docks }) {
  const from = useMemo(
    () => docks.find(d => d.name === fromDock),
    [docks, fromDock]
  );

  const to = useMemo(
    () => docks.find(d => d.name === toDock),
    [docks, toDock]
  );

  const center = useMemo(() => {
    if (!from || !to) return null;

    return [
      (from.lat + to.lat) / 2,
      (from.lng + to.lng) / 2
    ];
  }, [from, to]);

  // 🚫 Safe early return AFTER hooks
  if (!from || !to || !center) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: 400, width: "100%", borderRadius: 14 }}
      >
        <RecenterMap center={center} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Marker position={[from.lat, from.lng]}>
          <Popup>
            <strong>From:</strong><br />
            {from.name}
          </Popup>
        </Marker>

        <Marker position={[to.lat, to.lng]}>
          <Popup>
            <strong>To:</strong><br />
            {to.name}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
