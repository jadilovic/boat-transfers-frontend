import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import Landing from "./pages/Landing";
import BoatCalling from "./pages/BoatCallingPage";
import BoatBooking from "./pages/BoatBookingPage";
import Calculator from "./pages/Calculator";
import DockMapPage from "./pages/DockMapPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RegisterTraveler from "./pages/RegisterTraveler";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";

// Routes
import AdminRoute from "./routes/AdminRoute";

// Guest-only wrapper
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>; // wait for session restore
  if (user) return <Navigate to="/" replace />; // redirect logged-in users
  return children;
}

// App component — NO Router, NO AuthProvider here
export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/boat-calling" element={<BoatCalling />} />
      <Route path="/boat-booking" element={<BoatBooking />} />
      <Route path="/dock-map" element={<DockMapPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Guest-only routes */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register-traveler"
        element={
          <GuestRoute>
            <RegisterTraveler />
          </GuestRoute>
        }
      />

      {/* Admin-only route */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}