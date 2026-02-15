import { useNavigate } from "react-router-dom";
import "./TransferChoice.css";

export default function TransferChoice({ isAuthenticated, onSelect }) {
  const navigate = useNavigate();

  // -----------------------------
  // NOT AUTHENTICATED (GUEST)
  // -----------------------------
  if (!isAuthenticated) {
    return (
      <div className="transfer-choice">
        <h2>Start your journey</h2>

        <div className="transfer-cards">
          <div className="transfer-card">
            <h3>🔑 Sign in to continue</h3>
            <p>
              Already have an account? Sign in to access boat calling,
              boat booking and your active trips.
            </p>
            <button onClick={() => navigate("/login")}>
              Sign in
            </button>
          </div>

          <div className="transfer-card">
            <h3>✨ Register to explore options</h3>
            <p>
              Create a free account to discover available routes,
              request instant pickups or book boats in advance.
            </p>
            <button onClick={() => navigate("/register")}>
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // AUTHENTICATED USER
  // -----------------------------
  return (
    <div className="transfer-choice">
      <h2>Choose how you want to travel</h2>

      <div className="transfer-cards">
        <div className="transfer-card">
          <h3>🚤 Boat Calling</h3>
          <p>
            Request an instant pickup from nearby docks.
            You must be close to the dock to call a boat.
          </p>
          <button onClick={() => onSelect("calling")}>
            Call a Boat
          </button>
        </div>

        <div className="transfer-card">
          <h3>📅 Boat Booking</h3>
          <p>
            Plan ahead by scheduling your boat for a specific
            date and time with guaranteed pickup.
          </p>
          <button onClick={() => onSelect("booking")}>
            Book a Boat
          </button>
        </div>
      </div>
    </div>
  );
}
