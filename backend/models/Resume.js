const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "userId is required"],
  },
  fileName: {
    type: String,
    required: [true, "fileName is required"],
    trim: true,
  },
  filePath: {
    type: String,
    required: [true, "filePath is required"],
  },
  fileType: {
    type: String,
    required: [true, "fileType (mimetype) is required"],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", resumeSchema);
