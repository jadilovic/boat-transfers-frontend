import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import BoatCalling from "./pages/BoatCallingPage";
import BoatBooking from "./pages/BoatBookingPage";
import Calculator from "./pages/Calculator";
import DockMapPage from "./pages/DockMapPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/boat-calling" element={<BoatCalling />} />
      <Route path="/boat-booking" element={<BoatBooking />} />
      <Route path="/dock-map" element={<DockMapPage />} />
    </Routes>
  );
}
