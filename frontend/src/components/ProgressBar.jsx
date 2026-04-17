const getColor = (value) => {
  if (value >= 80) return "#10b981";
  if (value >= 60) return "#3b82f6";
  if (value >= 40) return "#f59e0b";
  return "#f43f5e";
};

const ProgressBar = ({ label, value }) => {
  const color = getColor(value);
  const pct = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className="progress-bar-wrapper">
      <div className="progress-bar-header">
        <span className="progress-bar-label">{label}</span>
        <span className="progress-bar-value" style={{ color }}>{pct}%</span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            transition: "width 1.1s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
