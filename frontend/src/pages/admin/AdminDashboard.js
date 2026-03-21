import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Dashboard</h1>

      <p>Welcome, {user?.email}</p>
      <p>Role: {role}</p>

      <ul>
        <li>Manage users</li>
        <li>Manage operators</li>
        <li>View trips</li>
        <li>System settings</li>
      </ul>
    </div>
  );
}
