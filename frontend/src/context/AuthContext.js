import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // ✅ NEW

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();

      setSession(data.session);
      setUser(data.session?.user || null);

      if (data.session?.user) {
        await fetchUserRole(data.session.user.id);
      }

      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          const userRole = await fetchUserRole(session.user.id);

          // ✅ AUTO REDIRECT AFTER LOGIN
          if (event === "SIGNED_IN") {
            if (userRole === "admin") {
              navigate("/admin");
            } else if (userRole === "operator") {
              navigate("/operator");
            } else {
              navigate("/");
            }
          }
        } else {
          setRole(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    const userRole = data?.role || null;
    setRole(userRole);

    return userRole; // ✅ IMPORTANT
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    navigate("/login"); // ✅ redirect on logout
  };

  return (
    <AuthContext.Provider
      value={{ session, user, role, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);