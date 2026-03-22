import { useAuth } from "../../context/AuthContext";
import Layout from "../../components/Layout";

export default function AdminDashboard() {
  const { user } = useAuth();

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