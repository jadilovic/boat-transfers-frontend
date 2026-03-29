import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch profile for a given user ID
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Profile fetch error:", error.message);
        return null;
      }

      return data || null;
    } catch (err) {
      console.error("Profile fetch failed:", err);
      return null;
    }
  };

  // manually update auth user (called after login)
  const setAuthUser = (userData) => {
    setUser({ ...userData });
  };

  // initialize user session
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);

        const profileData = await fetchProfile(session.user.id);
        if (isMounted) {
          setProfile(profileData);
          setRole(profileData?.role || "traveler");
        }
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
      }

      if (isMounted) setLoading(false);
    };

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
          setRole(profileData?.role || "traveler");
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
        }

        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout failed:", err.message);
    } finally {
      setUser(null);
      setProfile(null);
      setRole(null);
      setLoading(false);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, role, loading, logout, setAuthUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);