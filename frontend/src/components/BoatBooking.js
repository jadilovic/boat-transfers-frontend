import { useState } from "react";
import "./BoatBooking.css";


export default function BoatBooking() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <section className="boat-booking">
      <h2>📅 Boat Booking</h2>

      <label>
        Pickup Date
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <label>
        Pickup Time
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </label>

      <button
        className="primary"
        disabled={!date || !time}
      >
        Continue Booking
      </button>
    </section>
  );
}
