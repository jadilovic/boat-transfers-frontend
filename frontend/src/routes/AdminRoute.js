import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();

  // ⏳ Wait until auth is ready
  if (loading) return <p>Loading...</p>;

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Not admin
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin access
  return children;
}