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
        <div className="overlay">
          <h1>Private Boat Transfers Across the Adriatic</h1>

          <p>
            Fast, safe and direct routes between Zadar and surrounding islands.
          </p>

          <button onClick={() => (window.location.href = "/calculator")}>
            Calculate Trip
          </button>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section className="booking">
        <h2>Request a Ride</h2>

        <form>
          <input placeholder="Your name" />
          <input placeholder="Pickup location" />
          <input placeholder="Destination" />
          <input placeholder="Passengers" type="number" min="1" />

          <button type="button">Send Request</button>
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
