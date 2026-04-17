const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  analyzeResume,
  getAnalysis,
  getUserAnalyses,
} = require("../controllers/analysisController");

// GET /api/analysis/ — must come before /:id
router.get("/", protect, getUserAnalyses);

// POST /api/analysis/
router.post("/", protect, analyzeResume);

// GET /api/analysis/:id
router.get("/:id", protect, getAnalysis);

module.exports = router;
