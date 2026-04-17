import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadResume } from "../services/resumeService";
import { analyzeResume } from "../services/analysisService";
import LoadingSpinner from "../components/LoadingSpinner";
import { FiUploadCloud, FiFile, FiX, FiZap } from "react-icons/fi";

const JOB_ROLES = [
  { value: "general", label: "General" },
  { value: "frontend developer", label: "Frontend Developer" },
  { value: "backend developer", label: "Backend Developer" },
  { value: "fullstack developer", label: "Full Stack Developer" },
  { value: "data analyst", label: "Data Analyst" },
  { value: "data scientist", label: "Data Scientist" },
  { value: "devops engineer", label: "DevOps Engineer" },
  { value: "ui ux designer", label: "UI/UX Designer" },
  { value: "mobile developer", label: "Mobile Developer" },
];

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("general");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleFileSelect = (f) => {
    if (!f) return;
    const ok = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!ok.includes(f.type)) { toast.error("Only PDF and DOCX files are allowed."); return; }
    if (f.size > 5 * 1024 * 1024) { toast.error("File must be under 5 MB."); return; }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error("Please select a file to upload."); return; }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    try {
      setProgress("Uploading your resume…");
      const { data: uploadData } = await uploadResume(formData);

      setProgress("Running AI analysis — this usually takes 10–20 seconds…");
      const { data: analysisData } = await analyzeResume(uploadData.resume.id, jobRole);

      toast.success("Analysis complete!");
      navigate(`/results/${analysisData.analysis._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
      setLoading(false);
      setProgress("");
    }
  };

  if (loading) return <LoadingSpinner message={progress} />;

  return (
    <div className="page-wrapper">
      <div className="upload-container">
        <div className="upload-header">
          <h1 className="page-title">Analyze Your Resume</h1>
          <p className="page-subtitle">
            Upload a PDF or DOCX and receive an instant AI-powered quality report
          </p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {/* Drop Zone */}
          <div
            className={`drop-zone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />

            {file ? (
              <div className="file-preview">
                <FiFile className="file-icon" size={28} />
                <div>
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{(file.size / 1024).toFixed(0)} KB</div>
                </div>
                <button
                  type="button"
                  className="file-remove"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                >
                  <FiX size={14} />
                </button>
              </div>
            ) : (
              <div className="drop-content">
                <FiUploadCloud className="drop-icon" size={40} />
                <p className="drop-text">Drop your resume here</p>
                <p className="drop-hint">or click to browse files</p>
                <p className="drop-formats">PDF · DOCX &nbsp;·&nbsp; Max 5 MB</p>
              </div>
            )}
          </div>

          {/* Job Role */}
          <div className="form-group">
            <label className="form-label">Target Job Role</label>
            <select
              className="role-select"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            >
              {JOB_ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <p className="form-hint">
              Selecting the right role improves keyword match accuracy.
            </p>
          </div>

          <button type="submit" className="btn-analyze" disabled={!file}>
            <FiZap size={16} />
            Analyze with AI
          </button>
        </form>

        {/* Tips */}
        <div className="upload-tips">
          <h3>💡 Tips for a better score</h3>
          <ul>
            <li>Use clear section headers — Experience, Education, Skills, Projects</li>
            <li>Quantify your impact: "Reduced load time by 45%", "Managed team of 6"</li>
            <li>Start bullet points with strong action verbs (Built, Led, Optimized)</li>
            <li>Aim for 1–2 pages (200–800 words)</li>
            <li>Include your email, phone and LinkedIn URL</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
