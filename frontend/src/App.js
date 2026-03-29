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
import Profile from "./pages/Profile";
import AuthCallback from "./pages/AuthCallback";

// Routes
import AdminRoute from "./routes/AdminRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

// Guest-only wrapper
function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (user) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Landing />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/dock-map" element={<DockMapPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* GUEST ONLY */}
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

      {/* PROTECTED ROUTES */}
      <Route
        path="/boat-calling"
        element={
          <ProtectedRoute>
            <BoatCalling />
          </ProtectedRoute>
        }
      />
      <Route
        path="/boat-booking"
        element={
          <ProtectedRoute>
            <BoatBooking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTE */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}