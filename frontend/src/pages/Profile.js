import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { supabase } from "../utils/supabase";

export default function Profile() {
  const { user, profile, loading } = useAuth();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch and populate the form when profile is loaded
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setCity(profile.city || "");
      setState(profile.state || "");
    } else {
      // Fetch the profile from Supabase if it's not available
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error.message);
        } else {
          setName(data.name || "");
          setCity(data.city || "");
          setState(data.state || "");
        }
      };

      if (user) {
        fetchProfile();
      }
    }
  }, [profile, user]);

  // Handle profile save
  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setMessage(""); // Clear any previous message

    try {
      const updates = {
        id: user.id,
        name,
        city,
        state,
      };

      // Perform the upsert to update the profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .upsert(updates, { returning: "representation" })
        .single();

      if (error) throw error;

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed:", err.message);
      setMessage("Error updating profile. Try again.");
    } finally {
      setSaving(false); // Reset saving state
    }
  };

  // Handle loading and unauthorized access
  if (loading) return <Layout><p>Loading profile...</p></Layout>;
  if (!user) return <Layout><p>You must be logged in to view this page.</p></Layout>;

  return (
    <Layout>
      <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
        <h2>User Profile</h2>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <div style={{ marginTop: 20 }}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: 8, margin: "5px 0" }}
            />
          </label>

          <label>
            City:
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ width: "100%", padding: 8, margin: "5px 0" }}
            />
          </label>

          <label>
            State:
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{ width: "100%", padding: 8, margin: "5px 0" }}
            />
          </label>

          <button
            onClick={handleSave}
            style={{ marginTop: 10, padding: 10, width: "100%" }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

          {message && (
            <p style={{ color: message.includes("Error") ? "red" : "green", marginTop: 10 }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}