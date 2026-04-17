import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLogOut, FiUser, FiUpload, FiGrid } from "react-icons/fi";

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to={token ? "/dashboard" : "/login"} className="navbar-brand">
        <div className="brand-logo-wrap">
          <img src="/favicon.svg" alt="ResumeAI" />
        </div>
        <span className="brand-name">
          ResumeAI<span className="brand-dot">.</span>
        </span>
      </Link>

      <div className="navbar-links">
        {token ? (
          <>
            <Link to="/dashboard" className="nav-link">
              <FiGrid size={14} /> Dashboard
            </Link>
            <Link to="/upload" className="nav-link">
              <FiUpload size={14} /> Upload
            </Link>
            <div className="nav-user">
              <FiUser size={12} />
              <span>{user?.name}</span>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              <FiLogOut size={13} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
