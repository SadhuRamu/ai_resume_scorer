const getLabel = (score) => {
  if (score >= 80) return { text: "Excellent", color: "#10b981" };
  if (score >= 60) return { text: "Good", color: "#3b82f6" };
  if (score >= 40) return { text: "Average", color: "#f59e0b" };
  return { text: "Poor", color: "#f43f5e" };
};

const ScoreCard = ({ label, score }) => {
  const { text, color } = getLabel(score);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="score-card">
      <svg width="110" height="110" viewBox="0 0 110 110">
        {/* Track */}
        <circle
          cx="55" cy="55" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="9"
        />
        {/* Filled arc */}
        <circle
          cx="55" cy="55" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
        {/* Score number */}
        <text
          x="55" y="51"
          textAnchor="middle"
          fill="white"
          fontSize="19"
          fontWeight="800"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          letterSpacing="-1"
        >
          {Math.round(score)}
        </text>
        <text
          x="55" y="64"
          textAnchor="middle"
          fill="rgba(242,242,252,0.4)"
          fontSize="9"
          fontWeight="500"
          fontFamily="'Inter', sans-serif"
          letterSpacing="0.5"
        >
          / 100
        </text>
      </svg>
      <div className="score-card-label">{label}</div>
      <div className="score-card-badge" style={{ background: color + "18", color, border: `1px solid ${color}30` }}>
        {text}
      </div>
    </div>
  );
};

export default ScoreCard;
