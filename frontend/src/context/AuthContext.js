import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Supabase user
  const [profile, setProfile] = useState(null); // Profile from DB
  const [role, setRole] = useState(null);       // Role from profile
  const [loading, setLoading] = useState(true); // Loading state

  // Function to set the authenticated user (setAuthUser)
  const setAuthUser = (user) => {
    setUser(user);
  };

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
        // Check if session exists in localStorage
        const storedSession = localStorage.getItem('supabase.auth.token');
        if (storedSession) {
          const { data } = JSON.parse(storedSession);
          const session = data?.session;

          if (session?.user && isMounted) {
            setAuthUser(session.user);  // Set the user using setAuthUser
            const profileData = await fetchProfile(session.user.id);
            if (isMounted) {
              setProfile(profileData);
              setRole(profileData?.role || "traveler");
            }
          } else if (isMounted) {
            setAuthUser(null);  // Clear the user if no session
            setProfile(null);
            setRole(null);
          }
        } else {
          // If no session, mark loading as false directly
          setLoading(false);
        }
      } catch (err) {
        console.error("Error initializing session:", err);
        if (isMounted) {
          setAuthUser(null);  // Clear the user if error occurs
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
          setAuthUser(session.user);  // Set the user on auth state change
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
          setRole(profileData?.role || "traveler");
        } else {
          setAuthUser(null);  // Clear the user on logout
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

  // Inside AuthContext.js

  const logout = async () => {
    setLoading(true); // Set loading to true while logging out
    try {
      await supabase.auth.signOut(); // Sign out from supabase

      // Remove user data and token from localStorage
      localStorage.removeItem('supabase.auth.token'); 

      // Clear user state and profile
      setAuthUser(null);  // Make sure to clear the user after logout
      setProfile(null);
      setRole(null);
    } catch (err) {
      console.error("Logout failed:", err.message);
    } finally {
      setLoading(false); // Set loading to false after the logout process
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, profile, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);