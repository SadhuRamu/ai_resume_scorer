import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: read persisted auth from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser); // may throw
        setToken(storedToken);
        setUser(parsedUser);
      } else {
        // Either one is missing — clear both to keep state consistent
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      // JSON.parse failed — corrupted storage, wipe it
      console.error("AuthContext: localStorage parse error, clearing auth.", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    } finally {
      // Always mark loading done so consumers can trust the state
      setLoading(false);
    }
  }, []);

  /**
   * Call after a successful login/register API response.
   * @param {Object} userData  - user object from API  { id, name, email, role }
   * @param {string} tokenValue - JWT string from API
   */
  const login = (userData, tokenValue) => {
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(tokenValue);
  };

  /**
   * Clears all auth state and persisted storage.
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook — throws if used outside AuthProvider.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export default AuthContext;
