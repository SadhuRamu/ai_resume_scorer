const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const {
  uploadResume,
  getResume,
  getUserResumes,
} = require("../controllers/resumeController");

// POST /api/resume/upload
router.post("/upload", protect, upload.single("resume"), uploadResume);

// GET /api/resume/ — must come before /:id
router.get("/", protect, getUserResumes);

// GET /api/resume/:id
router.get("/:id", protect, getResume);

module.exports = router;
