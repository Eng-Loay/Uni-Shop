import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuthStatus = async () => {
      const storedUserId = localStorage.getItem("userId");
      const storedRole = localStorage.getItem("role");
      const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (storedUserId && storedRole && storedIsLoggedIn) {
        setUserId(storedUserId);
        setUserRole(storedRole);
        setIsAuthenticated(true);
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (userData) => {
    if (userData && userData.id && userData.role) {
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("isLoggedIn", "true");

      setUserId(userData.id);
      setUserRole(userData.role);
      setIsAuthenticated(true);

      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("isLoggedIn");

      setUserId(null);
      setUserRole(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userId,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
