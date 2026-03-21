import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUserRole = async (userId) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Role fetch error:", error.message);
          return null;
        }

        return data?.role || null;
      } catch (err) {
        console.error("Role fetch failed:", err);
        return null;
      }
    };

    const loadSession = async () => {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        const role = await fetchUserRole(session.user.id);
        if (isMounted) setRole(role);
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false); // ✅ ALWAYS stop loading
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        const role = await fetchUserRole(session.user.id);
        if (isMounted) setRole(role);
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false); // ✅ ALWAYS stop loading
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // ✅ FIXED logout (NO loading state!)
  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
    }

    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);