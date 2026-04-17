/**
 * seedKeywords.js
 *
 * Seeds the `keywords` MongoDB collection with role-based keyword sets.
 *
 * Usage:
 *   npm run seed          (from backend/ directory)
 *   node config/seedKeywords.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from the backend root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const Keyword = require("../models/Keyword");

const keywordSets = [
  {
    jobRole: "frontend developer",
    keywords: [
      "react", "javascript", "html", "css", "tailwind", "redux",
      "typescript", "nextjs", "webpack", "responsive design",
      "rest api", "git", "figma", "bootstrap", "vite",
      "vue", "angular", "sass", "scss", "jest", "testing",
      "accessibility", "performance", "dom", "hooks", "context api",
    ],
  },
  {
    jobRole: "backend developer",
    keywords: [
      "nodejs", "express", "mongodb", "sql", "postgresql", "rest api",
      "graphql", "docker", "aws", "microservices", "jwt", "redis",
      "python", "java", "spring boot", "api design",
      "mysql", "authentication", "oauth", "linux", "nginx",
      "ci/cd", "testing", "security", "server", "nosql",
    ],
  },
  {
    jobRole: "fullstack developer",
    keywords: [
      "react", "nodejs", "mongodb", "express", "javascript",
      "typescript", "rest api", "git", "docker", "aws",
      "html", "css", "tailwind", "redux", "postgresql",
      "mern", "mean", "fullstack", "frontend", "backend",
      "database", "deployment", "ci/cd", "agile", "scrum",
    ],
  },
  {
    jobRole: "data analyst",
    keywords: [
      "python", "sql", "excel", "tableau", "power bi", "pandas",
      "numpy", "matplotlib", "data visualization", "statistics",
      "machine learning", "r", "jupyter", "etl", "data cleaning",
      "seaborn", "regression", "hypothesis testing", "a/b testing",
      "kpi", "dashboard", "reporting", "google analytics", "looker",
    ],
  },
  {
    jobRole: "data scientist",
    keywords: [
      "python", "r", "machine learning", "deep learning", "tensorflow",
      "pytorch", "scikit-learn", "pandas", "numpy", "statistics",
      "nlp", "computer vision", "sql", "big data", "spark",
      "hadoop", "feature engineering", "model deployment", "regression",
      "classification", "clustering", "neural network", "ai",
      "data visualization", "jupyter",
    ],
  },
  {
    jobRole: "devops engineer",
    keywords: [
      "docker", "kubernetes", "aws", "ci/cd", "jenkins", "terraform",
      "ansible", "linux", "bash", "git", "monitoring", "nginx",
      "azure", "gcp", "prometheus",
      "grafana", "helm", "microservices", "cloud", "infrastructure",
      "security", "networking", "load balancer", "auto scaling", "devops",
    ],
  },
  {
    jobRole: "mobile developer",
    keywords: [
      "react native", "flutter", "swift", "kotlin", "ios", "android",
      "xcode", "android studio", "firebase", "redux", "state management",
      "rest api", "graphql", "mobile ui", "push notifications",
      "app store", "google play", "typescript", "dart", "objective-c",
      "java", "testing", "performance", "debugging", "git",
    ],
  },
  {
    jobRole: "ui ux designer",
    keywords: [
      "figma", "sketch", "adobe xd", "invision", "prototyping", "wireframing",
      "user research", "usability testing", "information architecture",
      "design system", "typography", "color theory", "responsive design",
      "accessibility", "ux writing", "journey mapping", "persona",
      "heuristic", "a/b testing", "html", "css", "interaction design",
      "visual design",
    ],
  },
];

const seed = async () => {
  try {
    console.log("🔌 Connecting to MongoDB…");
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Connected: ${mongoose.connection.host}`);

    // Wipe existing keyword documents
    const deleted = await Keyword.deleteMany({});
    console.log(`🗑️  Removed ${deleted.deletedCount} existing keyword document(s).`);

    // Insert fresh seed data
    const inserted = await Keyword.insertMany(keywordSets);
    console.log(`🌱 Seeded ${inserted.length} keyword sets successfully:`);
    inserted.forEach((k) => console.log(`   • ${k.jobRole} (${k.keywords.length} keywords)`));
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB disconnected. Done.");
  }
};

seed();
