import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

/**
 * GuestRoute — redirects already-authenticated users away from login/register.
 * Must be inside AuthProvider to read context.
 */
const GuestRoute = ({ children }) => {
  const { token, loading } = useAuth();

  // While loading, render nothing (or a spinner) — never redirect prematurely
  if (loading) return null;

  // Already logged in → send to dashboard
  if (token) return <Navigate to="/dashboard" replace />;

  return children;
};

/**
 * AppRoutes is a separate component so that useAuth() can be called inside
 * the AuthProvider tree (App itself wraps with AuthProvider below).
 */
const AppRoutes = () => {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <Routes>
          {/* Root → always redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Guest-only routes — redirect logged-in users to dashboard */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          {/* Protected routes — redirect unauthenticated users to login */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadResume />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results/:id"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <span className="footer-spark">✦</span>
        Powered by AI &nbsp;·&nbsp; ResumeAI Scorer
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />

        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="dark"
          toastStyle={{
            background: "#0e0e1a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.875rem",
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
