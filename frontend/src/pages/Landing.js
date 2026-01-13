import Layout from "../components/Layout";
import TransferChoice from "../components/TransferChoice";
import "./Landing.css";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Fast. Private. Direct Boat Transfers.</h1>
          <p>
            Book a private transfer across the Zadar archipelago — quick,
            comfortable and transparent pricing.
          </p>

          <button
            className="primary"
            onClick={() => navigate("/calculator")}
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

      {/* TRANSFER CHOICE */}
      <TransferChoice
        onSelect={(type) => {
          if (type === "calling") navigate("/boat-calling");
          if (type === "booking") navigate("/boat-booking");
        }}
      />

      {/* FEATURES */}
      <section className="features">
        <div className="card">
          <h3>⚓ Pickup Anywhere</h3>
          <p>Choose your island or harbor — we handle the rest.</p>
        </div>

        <div className="card">
          <h3>💶 Transparent Pricing</h3>
          <p>No surprises — distance based pricing + per passenger.</p>
        </div>

        <div className="card">
          <h3>⏱ Fast & Flexible</h3>
          <p>Schedule your ride — skip crowded ferries.</p>
        </div>
      </section>
    </Layout>
  );
}
