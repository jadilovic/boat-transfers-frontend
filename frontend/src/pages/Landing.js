import { useState } from "react";

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="landing">
      <header className="navbar">
        <div className="logo">🚤 Island Boat Transfers</div>

        <nav className={menuOpen ? "nav open" : "nav"}>
          <a href="/">Home</a>
          <a href="/calculator">Calculator</a>
          <a href="#">About</a>
        </nav>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span />
          <span />
          <span />
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Fast. Private. Direct Boat Transfers.</h1>

          <p>
            Book a private transfer across the Zadar archipelago — quick,
            comfortable and transparent pricing.
          </p>

          <button
            className="primary"
            onClick={() => (window.location.href = "/calculator")}
          >
            Calculate Trip
          </button>
        </div>

        <div className="hero-graphic">
          {/* your SVG kept exactly — only left as-is */}
          {/* … */}
        </div>
      </section>

      {/* BOOKING FORM */}
      <section className="booking">
        <h2>Request a Ride</h2>

        <form>
          <label>
            Your name
            <input placeholder="John Doe" />
          </label>

          <label>
            Pickup location
            <input placeholder="Eg. Zadar Marina" />
          </label>

          <label>
            Destination
            <input placeholder="Eg. Dugi Otok" />
          </label>

          <label>
            Passengers
            <input type="number" min="1" placeholder="1" />
          </label>

          <button type="button" className="secondary">
            Send Request
          </button>
        </form>
      </section>

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

      <footer className="footer">
        © {new Date().getFullYear()} Island Boat Transfers
      </footer>
    </div>
  );
}
