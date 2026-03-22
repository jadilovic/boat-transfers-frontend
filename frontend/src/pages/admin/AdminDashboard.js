import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../../components/Layout";

export default function AdminDashboard() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login", { replace: true });
      } else if (role !== "admin") {
        navigate("/", { replace: true });
      }
    }
  }, [user, role, loading, navigate]);

  // ⏳ Spinner instead of plain text
  if (loading) {
    return (
      <Layout>
        <div style={{ padding: 40, textAlign: "center" }}>
          <div className="spinner" />
          <p>Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: 40 }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.email}</p>

        <div style={{ marginTop: 30 }}>
          <h3>Admin Actions</h3>
          <ul>
            <li>Manage users</li>
            <li>Manage operators</li>
            <li>View trips</li>
            <li>System settings</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}