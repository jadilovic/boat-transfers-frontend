import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Login with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      const user = data.user;

      if (!user) {
        alert("Login failed");
        return;
      }

      // 2️⃣ Fetch role from your users table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(profileError);
        alert("Could not fetch user role");
        return;
      }

      if (!profile) {
        alert("User profile not found");
        return;
      }

      // 3️⃣ Save user info locally
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", profile.role);

      // 4️⃣ Redirect based on role
      if (profile.role === "admin") {
        navigate("/admin");
      } else if (profile.role === "operator") {
        navigate("/operator");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "0 auto" }}>
      <h2>Boat App Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />

      <br /><br />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ width: "100%", padding: 12 }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}