import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAnalysis } from "../services/analysisService";
import ScoreCard from "../components/ScoreCard";
import ProgressBar from "../components/ProgressBar";
import { toast } from "react-toastify";
import {
  FiCheckCircle, FiAlertCircle, FiTag, FiList,
  FiFileText, FiDownload, FiArrowLeft, FiZap,
} from "react-icons/fi";

const Results = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data } = await getAnalysis(id);
        setAnalysis(data.analysis);
      } catch (err) {
        toast.error("Failed to load analysis results.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  const downloadReport = () => {
    if (!analysis) return;
    const lines = [
      `RESUME ANALYSIS REPORT`,
      `Generated : ${new Date().toLocaleString()}`,
      `File      : ${analysis.resumeId?.fileName || "Resume"}`,
      `Job Role  : ${analysis.jobRole || "General"}`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `OVERALL SCORE  : ${Math.round(analysis.overallScore)}%`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `SCORE BREAKDOWN`,
      `  ATS Compatibility : ${Math.round(analysis.atsScore)}%`,
      `  Keyword Match     : ${Math.round(analysis.keywordScore)}%`,
      `  Readability       : ${Math.round(analysis.readabilityScore)}%`,
      `  Formatting        : ${Math.round(analysis.formattingScore)}%`,
      ``,
      `STRENGTHS`,
      ...(analysis.strengths || []).map((s) => `  ✓ ${s}`),
      ``,
      `WEAKNESSES`,
      ...(analysis.weaknesses || []).map((w) => `  ✗ ${w}`),
      ``,
      `SUGGESTIONS`,
      ...(analysis.suggestions || []).map((s, i) => `  ${i + 1}. ${s}`),
      ``,
      `MISSING KEYWORDS`,
      `  ${(analysis.missingKeywords || []).join(", ")}`,
      ``,
      `AI IMPROVED SUMMARY`,
      `  ${analysis.aiSummary || "Not available"}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume_analysis_report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading results…</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="page-wrapper">
        <div className="empty-state">
          <p>Analysis not found.</p>
          <Link to="/dashboard" className="btn-primary" style={{ marginTop: "0.5rem" }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const strengths = (analysis.strengths || []).filter(
    (s) => s && !s.toLowerCase().includes("could not retrieve")
  );
  const weaknesses = (analysis.weaknesses || []).filter(
    (w) => w && !w.toLowerCase().includes("could not retrieve")
  );
  const suggestions = (analysis.suggestions || []).filter(
    (s) => s && !s.toLowerCase().includes("please try again")
  );

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="results-header">
        <Link to="/dashboard" className="back-link">
          <FiArrowLeft size={13} /> Dashboard
        </Link>
        <div className="results-title-row">
          <div>
            <h1 className="page-title" style={{ fontSize: "1.6rem" }}>Analysis Results</h1>
            <p className="page-subtitle" style={{ marginTop: "0.3rem" }}>
              <FiFileText size={12} style={{ marginRight: "4px" }} />
              {analysis.resumeId?.fileName || "Resume"} &nbsp;·&nbsp;
              <span style={{ textTransform: "capitalize" }}>{analysis.jobRole || "General"}</span>
            </p>
          </div>
          <button className="btn-download" onClick={downloadReport}>
            <FiDownload size={13} /> Download Report
          </button>
        </div>
      </div>

      {/* Scores */}
      <div className="scores-grid">
        <ScoreCard label="Overall Score" score={analysis.overallScore} />
        <ScoreCard label="ATS Score" score={analysis.atsScore} />
        <ScoreCard label="Keywords" score={analysis.keywordScore} />
        <ScoreCard label="Readability" score={analysis.readabilityScore} />
        <ScoreCard label="Formatting" score={analysis.formattingScore} />
      </div>

      {/* Score Breakdown */}
      <div className="results-section glass-card">
        <h2 className="results-section-title">Score Breakdown</h2>
        <div className="progress-list">
          <ProgressBar label="ATS Compatibility" value={analysis.atsScore} />
          <ProgressBar label="Keyword Match" value={analysis.keywordScore} />
          <ProgressBar label="Readability" value={analysis.readabilityScore} />
          <ProgressBar label="Formatting" value={analysis.formattingScore} />
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      {(strengths.length > 0 || weaknesses.length > 0) && (
        <div className="sw-grid">
          <div className="results-section glass-card">
            <h2 className="results-section-title strength-title">
              <FiCheckCircle size={14} /> Strengths
            </h2>
            {strengths.length > 0 ? (
              <ul className="item-list">
                {strengths.map((s, i) => (
                  <li key={i} className="item-strength">
                    <FiCheckCircle className="item-icon-strength" size={13} />
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No strengths detected yet.</p>
            )}
          </div>

          <div className="results-section glass-card">
            <h2 className="results-section-title weakness-title">
              <FiAlertCircle size={14} /> Weaknesses
            </h2>
            {weaknesses.length > 0 ? (
              <ul className="item-list">
                {weaknesses.map((w, i) => (
                  <li key={i} className="item-weakness">
                    <FiAlertCircle className="item-icon-weakness" size={13} />
                    {w}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No critical weaknesses found.</p>
            )}
          </div>
        </div>
      )}

      {/* Missing Keywords */}
      {analysis.missingKeywords?.length > 0 && (
        <div className="results-section glass-card">
          <h2 className="results-section-title">
            <FiTag size={14} /> Missing Keywords
          </h2>
          <div className="keyword-chips">
            {analysis.missingKeywords.map((kw, i) => (
              <span key={i} className="keyword-chip">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="results-section glass-card">
          <h2 className="results-section-title">
            <FiList size={14} /> Suggestions
          </h2>
          <ol className="suggestion-list">
            {suggestions.map((s, i) => (
              <li key={i} className="suggestion-item">
                <span className="suggestion-num">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* AI Improved Summary */}
      {analysis.aiSummary && analysis.aiSummary.trim().length > 10 && (
        <div className="results-section glass-card">
          <h2 className="results-section-title">
            <FiZap size={14} style={{ color: "var(--violet-light)" }} /> AI-Improved Summary
          </h2>
          <p className="ai-summary-text">{analysis.aiSummary}</p>
        </div>
      )}

      {/* Actions */}
      <div className="results-actions">
        <Link to="/upload" className="btn-primary">Upload Another Resume</Link>
        <button className="btn-secondary" onClick={downloadReport}>
          <FiDownload size={14} /> Download Report
        </button>
      </div>
    </div>
  );
};

export default Results;
