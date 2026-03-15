import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    state: "",
    city: ""
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Step 1: Handle email verification callback
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase parses token from URL automatically
        const { data: { session }, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });

        if (error) {
          alert("Failed to verify email: " + error.message);
          navigate("/"); // fallback
          return;
        }

        const currentUser = session.user;
        setUser(currentUser);

        // Step 2: Check if traveler profile exists
        const { data: existingProfile } = await supabase
          .from("users")
          .select("*")
          .eq("supabase_id", currentUser.id)
          .single();

        if (!existingProfile) {
          // User exists in Auth but profile missing → show form
          setLoading(false);
        } else {
          // Already has profile → redirect to login
          navigate("/login");
        }

      } catch (err) {
        console.error(err);
        alert("Something went wrong during verification.");
        navigate("/");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  // Step 3: Submit traveler profile
  const handleSubmitProfile = async (e) => {
    e.preventDefault();

    try {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert([{
          id: user.id,
          email: user.email,
          name: profileData.name,
          state: profileData.state,
          city: profileData.city,
          role: "traveler"
        }]);

      if (insertError) {
        console.error("Error inserting traveler profile:", insertError);
        alert("Failed to complete registration. Try again.");
        return;
      }

      alert("Registration completed! You can now login.");
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert("Unexpected error. Please try again.");
    }
  };

  if (loading) return <p>Verifying your email, please wait...</p>;

  return (
    <div style={{ padding: 40, maxWidth: 500, margin: "0 auto" }}>
      <h2>Complete Your Traveler Profile</h2>
      <p>Email verified: {user.email}</p>

      <form onSubmit={handleSubmitProfile}>
        <input
          placeholder="Full Name"
          value={profileData.name}
          onChange={e => setProfileData({ ...profileData, name: e.target.value })}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          placeholder="State"
          value={profileData.state}
          onChange={e => setProfileData({ ...profileData, state: e.target.value })}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          placeholder="City"
          value={profileData.city}
          onChange={e => setProfileData({ ...profileData, city: e.target.value })}
          required
          style={{ width: "100%", padding: 10, marginBottom: 20 }}
        />

        <button type="submit" style={{ width: "100%", padding: 12 }}>
          Complete Registration
        </button>
      </form>
    </div>
  );
}