import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut, FiUser, FiUpload, FiGrid } from "react-icons/fi";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, token, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // ⚠️ Do NOT render the navbar at all while auth state is being hydrated
  // from localStorage. This prevents the "ghost" flash of logged-in links.
  if (loading) return null;

  const isAuthenticated = !!(token && user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Brand */}
      <NavLink
        to={isAuthenticated ? "/dashboard" : "/login"}
        className="navbar-brand"
      >
        <div className="brand-logo-wrap">
          <img src="/favicon.svg" alt="ResumeAI logo" />
        </div>
        <span className="brand-name">
          ResumeAI<span className="brand-dot">.</span>
        </span>
      </NavLink>

      {/* Navigation links */}
      <div className="navbar-links">
        {isAuthenticated ? (
          /* ── Authenticated links ── */
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "nav-link nav-link--active" : "nav-link"
              }
            >
              <FiGrid size={14} /> Dashboard
            </NavLink>

            <NavLink
              to="/upload"
              className={({ isActive }) =>
                isActive ? "nav-link nav-link--active" : "nav-link"
              }
            >
              <FiUpload size={14} /> Upload
            </NavLink>

            <div className="nav-user">
              <FiUser size={12} />
              <span>{user?.name}</span>
            </div>

            <button className="btn-logout" onClick={handleLogout}>
              <FiLogOut size={13} /> Logout
            </button>
          </>
        ) : (
          /* ── Guest links ── */
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-link nav-link--active" : "nav-link"
              }
            >
              Login
            </NavLink>

            <NavLink to="/register" className="btn-primary-sm">
              Get Started
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
