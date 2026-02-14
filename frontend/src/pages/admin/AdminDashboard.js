export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>

      <ul>
        <li>Manage users</li>
        <li>Manage operators</li>
        <li>View trips</li>
        <li>System settings</li>
      </ul>
    </div>
  );
}
