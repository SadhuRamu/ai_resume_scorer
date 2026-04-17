const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
    required: true,
  },
  jobRole: {
    type: String,
    default: "general",
  },
  overallScore: {
    type: Number,
    default: 0,
  },
  atsScore: {
    type: Number,
    default: 0,
  },
  keywordScore: {
    type: Number,
    default: 0,
  },
  readabilityScore: {
    type: Number,
    default: 0,
  },
  formattingScore: {
    type: Number,
    default: 0,
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
