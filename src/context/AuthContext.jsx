import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { setAccessToken } from "@/api/tokenService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = checking
  const [loading, setLoading] = useState(true);

  // Check refresh token on app load
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        setAccessToken(res.data.data.accessToken);
        setIsAuthenticated(true);

      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
