const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
    required: [true, "resumeId is required"],
  },
  jobRole: {
    type: String,
    default: "general",
    lowercase: true,
    trim: true,
  },
  overallScore: {
    type: Number,
    default: 0,
    min: [0, "overallScore cannot be negative"],
    max: [100, "overallScore cannot exceed 100"],
  },
  atsScore: {
    type: Number,
    default: 0,
    min: [0, "atsScore cannot be negative"],
    max: [100, "atsScore cannot exceed 100"],
  },
  keywordScore: {
    type: Number,
    default: 0,
    min: [0, "keywordScore cannot be negative"],
    max: [100, "keywordScore cannot exceed 100"],
  },
  readabilityScore: {
    type: Number,
    default: 0,
    min: [0, "readabilityScore cannot be negative"],
    max: [100, "readabilityScore cannot exceed 100"],
  },
  formattingScore: {
    type: Number,
    default: 0,
    min: [0, "formattingScore cannot be negative"],
    max: [100, "formattingScore cannot exceed 100"],
  },
  suggestions: {
    type: [String],
    default: [],
  },
  missingKeywords: {
    type: [String],
    default: [],
  },
  strengths: {
    type: [String],
    default: [],
  },
  weaknesses: {
    type: [String],
    default: [],
  },
  aiSummary: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Analysis", analysisSchema);
