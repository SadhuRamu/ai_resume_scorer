import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserResumes } from "../services/resumeService";
import { getUserAnalyses } from "../services/analysisService";
import {
  FiUpload, FiFileText, FiBarChart2,
  FiClock, FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-toastify";

const scoreColor = (s) => {
  if (s >= 80) return "#10b981";
  if (s >= 60) return "#3b82f6";
  if (s >= 40) return "#f59e0b";
  return "#f43f5e";
};
const scoreLabel = (s) => {
  if (s >= 80) return "Excellent";
  if (s >= 60) return "Good";
  if (s >= 40) return "Average";
  return "Poor";
};
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [rRes, aRes] = await Promise.all([getUserResumes(), getUserAnalyses()]);
        setResumes(rRes.data.resumes || []);
        setAnalyses(aRes.data.analyses || []);
      } catch {
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const avgScore =
    analyses.length > 0
      ? Math.round(analyses.reduce((s, a) => s + a.overallScore, 0) / analyses.length)
      : null;

  return (
    <div className="page-wrapper">
      {/* Greeting */}
      <div className="dashboard-hero">
        <div>
          <h1 className="dashboard-greeting">
            Hello, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="dashboard-subtitle">
            Your AI-powered resume analysis hub · all results in one place
          </p>
        </div>
        <Link to="/upload" className="btn-primary">
          <FiUpload size={14} /> Upload Resume
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(59,130,246,0.12)" }}>
            <FiFileText style={{ color: "#3b82f6" }} />
          </div>
          <div>
            <div className="stat-value">{loading ? "—" : resumes.length}</div>
            <div className="stat-label">Resumes uploaded</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(124,58,237,0.12)" }}>
            <FiBarChart2 style={{ color: "#a78bfa" }} />
          </div>
          <div>
            <div className="stat-value">{loading ? "—" : analyses.length}</div>
            <div className="stat-label">Analyses complete</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(16,185,129,0.12)" }}>
            <FiBarChart2 style={{ color: "#10b981" }} />
          </div>
          <div>
            <div
              className="stat-value"
              style={{ color: avgScore ? scoreColor(avgScore) : "var(--text-1)" }}
            >
              {loading ? "—" : avgScore !== null ? `${avgScore}%` : "—"}
            </div>
            <div className="stat-label">Average score</div>
          </div>
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Recent Analyses</h2>
          {analyses.length > 0 && (
            <span className="section-badge">{analyses.length}</span>
          )}
        </div>

        {loading ? (
          <div className="empty-state"><div className="spinner" /></div>
        ) : analyses.length === 0 ? (
          <div className="empty-state">
            <FiBarChart2 className="empty-icon" />
            <p>No analyses yet — upload a resume to get started.</p>
            <Link to="/upload" className="btn-primary" style={{ marginTop: "0.5rem" }}>
              <FiUpload size={13} /> Upload Now
            </Link>
          </div>
        ) : (
          <div className="analysis-list">
            {analyses.slice(0, 8).map((a) => (
              <Link to={`/results/${a._id}`} key={a._id} className="analysis-card">
                <div className="analysis-card-left">
                  <div className="analysis-filename">
                    <FiFileText size={13} />
                    {a.resumeId?.fileName || "Resume"}
                  </div>
                  <div className="analysis-meta">
                    <FiClock size={11} />
                    {fmtDate(a.createdAt)} &nbsp;·&nbsp;
                    <span style={{ textTransform: "capitalize" }}>
                      {a.jobRole || "general"}
                    </span>
                  </div>
                </div>
                <div className="analysis-card-right">
                  <div>
                    <div className="analysis-score" style={{ color: scoreColor(a.overallScore) }}>
                      {Math.round(a.overallScore)}
                      <span className="analysis-score-pct">%</span>
                    </div>
                    <div
                      className="analysis-score-label"
                      style={{ color: scoreColor(a.overallScore) }}
                    >
                      {scoreLabel(a.overallScore)}
                    </div>
                  </div>
                  <FiChevronRight className="analysis-arrow" size={14} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Uploaded Resumes */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Uploaded Resumes</h2>
        </div>
        {loading ? null : resumes.length === 0 ? (
          <div className="empty-state">
            <FiFileText className="empty-icon" />
            <p>No resumes uploaded yet.</p>
          </div>
        ) : (
          <div className="resume-list">
            {resumes.map((r) => (
              <div key={r._id} className="resume-item">
                <FiFileText className="resume-icon" />
                <div>
                  <div className="resume-name">{r.fileName}</div>
                  <div className="resume-date">{fmtDate(r.uploadedAt)}</div>
                </div>
                <div className="resume-type-badge">
                  {r.fileType?.includes("pdf") ? "PDF" : "DOCX"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
