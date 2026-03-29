import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();

  // Only rely on THIS loading
  if (loading) return <p>Loading...</p>;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // 🔥 If NOT admin → redirect immediately
  if (role !== "admin") return <Navigate to="/" replace />;

  return children;
}