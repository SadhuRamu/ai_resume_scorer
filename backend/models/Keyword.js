const mongoose = require("mongoose");

const keywordSchema = new mongoose.Schema({
  jobRole: {
    type: String,
    required: [true, "jobRole is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  keywords: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Keyword", keywordSchema);
