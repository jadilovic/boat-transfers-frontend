import { useState } from "react";
import Layout from "../components/Layout";

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false); // can still control menu state if needed in Layout

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="hero" style={{ display: "flex", gap: 40, flexWrap: "wrap", alignItems: "center", marginBottom: 60 }}>
        <div className="hero-content" style={{ flex: 1 }}>
          <h1>Fast. Private. Direct Boat Transfers.</h1>
          <p>
            Book a private transfer across the Zadar archipelago — quick,
            comfortable and transparent pricing.
          </p>
          <button
            className="primary"
            onClick={() => (window.location.href = "/calculator")}
            style={{
              marginTop: 20,
              padding: "12px 24px",
              borderRadius: 10,
              background: "#2f80ed",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Calculate Trip
          </button>
        </div>

        <div className="hero-graphic">
          <svg
            className="boat-graphic"
            width="260"
            height="160"
            viewBox="0 0 260 160"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="40" y="80" width="160" height="20" rx="6" fill="#1a3c6e" />
            <polygon points="40,80 200,80 180,110 60,110" fill="#274b89" />
            <rect x="110" y="30" width="6" height="50" fill="#1a1a1a" />
            <polygon points="116,30 170,65 116,65" fill="#d9e7ff" />
            <path d="M0 120 Q130 160 260 120" fill="#a8d8ff" />
          </svg>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section className="booking" style={{ marginBottom: 60 }}>
        <h2>Request a Ride</h2>
        <form style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 400 }}>
          <label>
            Your name
            <input placeholder="John Doe" style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
          </label>

          <label>
            Pickup location
            <input placeholder="Eg. Zadar Marina" style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
          </label>

          <label>
            Destination
            <input placeholder="Eg. Dugi Otok" style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
          </label>

          <label>
            Passengers
            <input type="number" min="1" placeholder="1" style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
          </label>

          <button
            type="button"
            className="secondary"
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid #2f80ed",
              background: "#fff",
              color: "#2f80ed",
              fontWeight: 600,
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            Send Request
          </button>
        </form>
      </section>

      {/* FEATURES */}
      <section className="features" style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 40 }}>
        <div className="card" style={{ flex: 1, minWidth: 200, padding: 20, borderRadius: 12, background: "#f7f9fe", textAlign: "center" }}>
          <h3>⚓ Pickup Anywhere</h3>
          <p>Choose your island or harbor — we handle the rest.</p>
        </div>

        <div className="card" style={{ flex: 1, minWidth: 200, padding: 20, borderRadius: 12, background: "#f7f9fe", textAlign: "center" }}>
          <h3>💶 Transparent Pricing</h3>
          <p>No surprises — distance based pricing + per passenger.</p>
        </div>

        <div className="card" style={{ flex: 1, minWidth: 200, padding: 20, borderRadius: 12, background: "#f7f9fe", textAlign: "center" }}>
          <h3>⏱ Fast & Flexible</h3>
          <p>Schedule your ride — skip crowded ferries.</p>
        </div>
      </section>
    </Layout>
  );
}
