// src/routes/AdminRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  // 🔥 allow temporary null role while loading
  if (role === null) return <p>Loading...</p>;

  if (role !== "admin") return <Navigate to="/" replace />;

  return children;
}