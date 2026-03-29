import { useState } from "react";
import { supabase } from "../utils/supabase";

export default function RegisterTraveler() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    if (!email || !password) {
      alert("All fields required");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3001/auth/callback"
      }
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data?.user;

    // ⚠️ Only insert if new user
    if (user && user.identities?.length > 0) {
      await supabase.from("profiles").insert([
        {
          id: user.id,
          email: user.email,
          role: "traveler"
        }
      ]);
    }

    setMessage("Check your email to verify your account.");
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>

      <h2>Create Traveler Account</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}

      <br /><br />

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
        onClick={handleSignup}
        style={{ width: "100%", padding: 12 }}
      >
        Create Account
      </button>

    </div>
  );
}