import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

/**
 * ProtectedRoute
 *
 * Behaviour:
 *  - loading=true  → render a full-screen spinner (never redirect early)
 *  - loading=false, no token → redirect to /login
 *  - loading=false, token exists → render children
 *
 * The loading guard prevents a redirect "flash" that would happen if the
 * component rendered before useEffect in AuthContext had a chance to read
 * the token from localStorage.
 */
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        className="loading-screen"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: "1rem",
        }}
      >
        <div className="spinner" />
        <p style={{ color: "var(--text-muted, #aaa)", fontSize: "0.9rem" }}>
          Verifying session…
        </p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
