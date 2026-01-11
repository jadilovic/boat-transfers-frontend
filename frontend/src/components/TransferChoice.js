import "./TransferChoice.css";

export default function TransferChoice({ selected, onSelect }) {
  return (
    <div className="transfer-choice">
      <h2>Choose how you want to travel</h2>

      <div className="transfer-cards">
        <div className={`transfer-card ${selected === "calling" ? "selected" : ""}`}>
          <h3>🚤 Boat Calling</h3>
          <p>
            Instant pickup from nearby docks. You must be within 500m of the dock
            to call an available boat immediately.
          </p>
          <button onClick={() => onSelect("calling")}>
            Call a Boat
          </button>
        </div>

        <div className={`transfer-card ${selected === "booking" ? "selected" : ""}`}>
          <h3>📅 Boat Booking</h3>
          <p>
            Schedule your boat in advance. Choose date and time for a guaranteed
            pickup at your selected dock.
          </p>
          <button onClick={() => onSelect("booking")}>
            Book a Boat
          </button>
        </div>
      </div>
    </div>
  );
}
