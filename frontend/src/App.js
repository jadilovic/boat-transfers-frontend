import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import BoatCalling from "./pages/BoatCallingPage";
import BoatBooking from "./pages/BoatBookingPage";
import Calculator from "./pages/Calculator";
import DockMapPage from "./pages/DockMapPage";

import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RegisterTraveler from "./pages/RegisterTraveler";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/boat-calling" element={<BoatCalling />} />
      <Route path="/boat-booking" element={<BoatBooking />} />
      <Route path="/dock-map" element={<DockMapPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register-traveler" element={<RegisterTraveler />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
