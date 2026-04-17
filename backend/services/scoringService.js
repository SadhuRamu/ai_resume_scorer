// Predefined keywords for each job role
const roleKeywords = {
  "frontend developer": [
    "html", "css", "javascript", "react", "vue", "angular", "typescript",
    "webpack", "babel", "sass", "scss", "tailwind", "bootstrap", "jquery",
    "responsive design", "rest api", "git", "github", "figma", "ui", "ux",
    "redux", "context api", "hooks", "next.js", "vite", "jest", "testing",
    "accessibility", "performance", "dom", "browser"
  ],
  "backend developer": [
    "node.js", "express", "python", "django", "flask", "java", "spring",
    "rest api", "graphql", "mongodb", "mysql", "postgresql", "redis",
    "docker", "kubernetes", "aws", "azure", "gcp", "microservices",
    "authentication", "jwt", "oauth", "sql", "nosql", "api", "database",
    "server", "linux", "nginx", "git", "ci/cd", "testing", "security"
  ],
  "fullstack developer": [
    "react", "node.js", "mongodb", "express", "javascript", "typescript",
    "html", "css", "rest api", "graphql", "docker", "git", "aws",
    "mysql", "postgresql", "redis", "authentication", "jwt", "mern",
    "mean", "fullstack", "frontend", "backend", "database", "deployment",
    "ci/cd", "testing", "agile", "scrum", "linux", "nginx"
  ],
  "data analyst": [
    "python", "r", "sql", "excel", "tableau", "power bi", "statistics",
    "data visualization", "pandas", "numpy", "matplotlib", "seaborn",
    "machine learning", "data cleaning", "etl", "data warehouse", "bi",
    "regression", "hypothesis testing", "a/b testing", "kpi", "dashboard",
    "reporting", "google analytics", "looker", "jupyter", "data mining"
  ],
  "data scientist": [
    "python", "r", "machine learning", "deep learning", "tensorflow", "pytorch",
    "scikit-learn", "pandas", "numpy", "statistics", "nlp", "computer vision",
    "sql", "big data", "spark", "hadoop", "feature engineering", "model deployment",
    "regression", "classification", "clustering", "neural network", "ai",
    "data visualization", "jupyter", "tableau", "aws", "docker"
  ],
  "devops engineer": [
    "docker", "kubernetes", "jenkins", "ci/cd", "aws", "azure", "gcp",
    "terraform", "ansible", "linux", "bash", "python", "monitoring",
    "prometheus", "grafana", "nginx", "apache", "git", "github actions",
    "helm", "microservices", "cloud", "infrastructure", "security",
    "networking", "load balancer", "auto scaling", "devops"
  ],
  "ui ux designer": [
    "figma", "sketch", "adobe xd", "invision", "prototyping", "wireframing",
    "user research", "usability testing", "information architecture",
    "design system", "typography", "color theory", "responsive design",
    "accessibility", "ux writing", "journey mapping", "persona", "heuristic",
    "a/b testing", "html", "css", "interaction design", "visual design"
  ],
  "mobile developer": [
    "react native", "flutter", "swift", "kotlin", "ios", "android",
    "xcode", "android studio", "firebase", "redux", "state management",
    "rest api", "graphql", "mobile ui", "push notifications", "app store",
    "google play", "typescript", "javascript", "dart", "objective-c",
    "java", "testing", "performance", "debugging", "git"
  ],
  "general": [
    "communication", "teamwork", "leadership", "problem solving", "analytical",
    "project management", "agile", "scrum", "git", "microsoft office",
    "presentation", "collaboration", "critical thinking", "time management",
    "stakeholder management", "documentation", "research", "detail oriented"
  ],
};

/**
 * Calculate keyword score based on job role
 */
const calculateKeywordScore = (text, jobRole) => {
  const lowerText = text.toLowerCase();
  const normalizedRole = jobRole ? jobRole.toLowerCase().trim() : "general";
  const keywords = roleKeywords[normalizedRole] || roleKeywords["general"];

  let matches = 0;
  keywords.forEach((keyword) => {
    if (lowerText.includes(keyword.toLowerCase())) {
      matches++;
    }
  });

  const matchPercentage = (matches / keywords.length) * 100;
  return Math.min(100, Math.round(matchPercentage));
};

/**
 * Calculate ATS (Applicant Tracking System) compatibility score
 */
const calculateAtsScore = (text) => {
  const lowerText = text.toLowerCase();
  let score = 0;
  const maxScore = 100;

  // Check for key sections (each worth points)
  const sections = [
    { name: "experience", points: 15 },
    { name: "education", points: 15 },
    { name: "skills", points: 15 },
    { name: "summary", points: 10 },
    { name: "objective", points: 5 },
    { name: "projects", points: 10 },
    { name: "certifications", points: 10 },
    { name: "contact", points: 5 },
  ];

  sections.forEach((section) => {
    if (lowerText.includes(section.name)) {
      score += section.points;
    }
  });

  // Check for email pattern (5 points)
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) {
    score += 5;
  }

  // Check for phone number pattern (5 points)
  if (/(\+?\d[\s.-]?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/.test(text)) {
    score += 5;
  }

  // Check adequate length (5 points)
  if (text.split(" ").length >= 150) {
    score += 5;
  }

  return Math.min(maxScore, score);
};

/**
 * Calculate readability score based on sentence complexity
 */
const calculateReadabilityScore = (text) => {
  // Split into sentences
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length === 0) return 50;

  const wordCounts = sentences.map((s) => s.split(/\s+/).filter((w) => w.length > 0).length);
  const avgWordsPerSentence =
    wordCounts.reduce((sum, count) => sum + count, 0) / sentences.length;

  // Penalty for very long sentences (>30 words average)
  let score = 100;

  if (avgWordsPerSentence > 30) {
    score -= (avgWordsPerSentence - 30) * 3;
  } else if (avgWordsPerSentence > 20) {
    score -= (avgWordsPerSentence - 20) * 1.5;
  }

  // Additional penalty for very short text
  const totalWords = text.split(/\s+/).filter((w) => w.length > 0).length;
  if (totalWords < 50) {
    score -= 30;
  }

  // Penalty for excessively long sentences ratio
  const longSentences = wordCounts.filter((c) => c > 35).length;
  const longSentenceRatio = longSentences / sentences.length;
  score -= longSentenceRatio * 20;

  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Calculate formatting score
 */
const calculateFormattingScore = (text) => {
  let score = 0;

  // Check for bullet points
  const bulletPointMatches = text.match(/[•\-\*]\s+\w/g);
  if (bulletPointMatches && bulletPointMatches.length >= 3) {
    score += 25;
  } else if (bulletPointMatches && bulletPointMatches.length >= 1) {
    score += 10;
  }

  // Check for years/dates pattern (e.g., 2020, 2019-2023, Jan 2022)
  const datePattern =
    /\b(19|20)\d{2}\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(19|20)\d{2}\b/gi;
  const dateMatches = text.match(datePattern);
  if (dateMatches && dateMatches.length >= 2) {
    score += 25;
  } else if (dateMatches && dateMatches.length >= 1) {
    score += 10;
  }

  // Check word count (ideal 200-800 words)
  const wordCount = text
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  if (wordCount >= 200 && wordCount <= 800) {
    score += 30;
  } else if (wordCount >= 100 && wordCount < 200) {
    score += 15;
  } else if (wordCount > 800 && wordCount <= 1200) {
    score += 15;
  }

  // Check for uppercase section headers (common formatting technique)
  const upperCaseLines = text
    .split("\n")
    .filter(
      (line) =>
        line.trim().length > 2 &&
        line.trim().length < 30 &&
        line.trim() === line.trim().toUpperCase()
    );
  if (upperCaseLines.length >= 2) {
    score += 20;
  } else if (upperCaseLines.length >= 1) {
    score += 10;
  }

  return Math.min(100, score);
};

/**
 * Get keywords missing from the resume for a specific job role
 */
const getMissingKeywords = (text, jobRole) => {
  const lowerText = text.toLowerCase();
  const normalizedRole = jobRole ? jobRole.toLowerCase().trim() : "general";
  const keywords = roleKeywords[normalizedRole] || roleKeywords["general"];

  return keywords.filter(
    (keyword) => !lowerText.includes(keyword.toLowerCase())
  );
};

/**
 * Calculate overall weighted score
 */
const calculateOverallScore = (keywordScore, atsScore, readabilityScore, formattingScore) => {
  const overall =
    keywordScore * 0.35 +
    atsScore * 0.30 +
    readabilityScore * 0.20 +
    formattingScore * 0.15;

  return Math.round(overall * 100) / 100;
};

module.exports = {
  calculateKeywordScore,
  calculateAtsScore,
  calculateReadabilityScore,
  calculateFormattingScore,
  getMissingKeywords,
  calculateOverallScore,
};
