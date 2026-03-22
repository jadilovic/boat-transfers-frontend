import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait until session is restored
  if (loading) return <p>Loading...</p>;

  // If not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If logged in → allow access
  return children;
}