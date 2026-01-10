import "./TransferChoice.css";

export default function TransferChoice({ selected, onSelect }) {
  return (
    <section className="transfer-choice">
      <div
        className={`transfer-card ${selected === "calling" ? "selected" : ""}`}
      >
        <h3>Boat Calling</h3>
        <p>
          Get an instant transfer if you are within 500m of a dock. Available
          boats assigned automatically.
        </p>
        <button onClick={() => onSelect("calling")}>Select Boat Calling</button>
      </div>

      <div
        className={`transfer-card ${selected === "booking" ? "selected" : ""}`}
      >
        <h3>Boat Booking</h3>
        <p>
          Schedule a transfer with date & time. Flexible pickup from docks.
        </p>
        <button onClick={() => onSelect("booking")}>Select Boat Booking</button>
      </div>
    </section>
  );
}
