import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Supabase user
  const [profile, setProfile] = useState(null); // Profile from DB
  const [role, setRole] = useState(null);       // Role from profile
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch profile by user ID
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

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session;

        if (session?.user && isMounted) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          if (isMounted) {
            setProfile(profileData);
            setRole(profileData?.role || "traveler");
          }
        } else if (isMounted) {
          setUser(null);
          setProfile(null);
          setRole(null);
        }
      } catch (err) {
        console.error("Error initializing session:", err);
        if (isMounted) {
          setUser(null);
          setProfile(null);
          setRole(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initSession();

    // Listen to auth state changes
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
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);