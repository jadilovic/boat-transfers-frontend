import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user, role, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else if (role !== "admin") {
        navigate("/");
      }
    }
  }, [user, role, loading, navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>

      <button
        onClick={logout}
        style={{ padding: 10, marginTop: 20 }}
      >
        Logout
      </button>
    </div>
  );
}