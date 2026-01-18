import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Layout from "../components/Layout";
import { DOCKS } from "../data/docks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DockMapPage.css";

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 9);
  return null;
}

export default function DockMapPage() {
  const [area, setArea] = useState("zadar");
  const [fromDock, setFromDock] = useState(null);
  const navigate = useNavigate();

  const handleDockClick = (dock) => {
    if (!fromDock) {
      setFromDock(dock);
    } else {
      navigate(
        `/calculator?from=${fromDock.id}&to=${dock.id}`
      );
    }
  };

  return (
    <Layout>
      <section className="dock-map-page">
        <h2>Select Your Route</h2>
        <p>Click first dock for <strong>FROM</strong>, second for <strong>TO</strong></p>

        <div className="area-switch">
          {Object.keys(DOCKS).map((key) => (
            <button
              key={key}
              className={area === key ? "active" : ""}
              onClick={() => {
                setArea(key);
                setFromDock(null);
              }}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>

        <MapContainer
          center={DOCKS[area].center}
          zoom={9}
          className="dock-map"
        >
          <ChangeView center={DOCKS[area].center} />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {DOCKS[area].docks.map((dock) => (
            <Marker
              key={dock.id}
              position={[dock.lat, dock.lng]}
              eventHandlers={{
                click: () => handleDockClick(dock),
              }}
            >
              <Popup>
                <strong>{dock.name}</strong>
                <br />
                {!fromDock ? "Set as FROM" : "Set as TO"}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {fromDock && (
          <div className="from-indicator">
            FROM: <strong>{fromDock.name}</strong>
          </div>
        )}
      </section>
    </Layout>
  );
}
