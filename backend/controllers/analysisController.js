const Resume = require("../models/Resume");
const Analysis = require("../models/Analysis");
const { extractText } = require("../services/textExtractor");
const {
  calculateKeywordScore,
  calculateAtsScore,
  calculateReadabilityScore,
  calculateFormattingScore,
  getMissingKeywords,
  calculateOverallScore,
} = require("../services/scoringService");
const { analyzeWithAI } = require("../services/aiService");

/**
 * Generate meaningful local insights from scoring data
 * Used as fallback or merged with AI results
 */
const generateLocalInsights = (scores, jobRole) => {
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  // ATS insights
  if (scores.atsScore >= 75) {
    strengths.push("Strong ATS compatibility — your resume includes key structural sections");
  } else if (scores.atsScore >= 50) {
    weaknesses.push("Moderate ATS compatibility — some important sections may be missing");
    suggestions.push("Add clearly labelled sections: Summary, Experience, Education, Skills, Projects, Certifications");
  } else {
    weaknesses.push("Poor ATS compatibility — resume lacks essential structure for applicant tracking systems");
    suggestions.push("Restructure your resume with clearly labelled sections (Summary, Experience, Education, Skills)");
  }

  // Keyword insights
  if (scores.keywordScore >= 75) {
    strengths.push(`Excellent keyword alignment for ${jobRole === "general" ? "your field" : `a ${jobRole} role`}`);
  } else if (scores.keywordScore >= 50) {
    weaknesses.push(`Average keyword match for a ${jobRole === "general" ? "general" : jobRole} position — incorporate more relevant technical terms`);
    suggestions.push("Study the job description carefully and include matching keywords naturally throughout your resume");
  } else {
    weaknesses.push(`Low keyword density for a ${jobRole === "general" ? "general" : jobRole} role — missing many expected technical terms`);
    suggestions.push("Review the Missing Keywords list above and add the most relevant ones to your Skills section");
  }

  // Readability insights
  if (scores.readabilityScore >= 75) {
    strengths.push("Clear and concise writing style that is easy for recruiters to scan");
  } else if (scores.readabilityScore < 50) {
    weaknesses.push("Writing is overly complex — sentences are too long and dense");
    suggestions.push("Break complex sentences into short, impactful bullet points (8–12 words each)");
  }

  // Formatting insights
  if (scores.formattingScore >= 75) {
    strengths.push("Well-formatted resume with good use of bullet points and date ranges");
  } else if (scores.formattingScore < 50) {
    weaknesses.push("Formatting needs improvement — inconsistent structure reduces visual scanability");
    suggestions.push("Use consistent bullet points (•), include date ranges for every role, and maintain uniform indentation");
  }

  // Universal suggestions
  suggestions.push("Quantify your impact with measurable results (e.g., 'Increased performance by 40%', 'Managed a team of 8')");
  suggestions.push("Start each bullet point with a strong action verb (Developed, Implemented, Led, Optimized, Delivered)");

  return { strengths, weaknesses, suggestions };
};

/**
 * @route   POST /api/analysis/
 * @access  Protected
 */
const analyzeResume = async (req, res) => {
  try {
    const { resumeId, jobRole } = req.body;

    if (!resumeId) {
      return res.status(400).json({ success: false, message: "resumeId is required." });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found or access denied." });
    }

    // Extract text
    let extractedText;
    try {
      extractedText = await extractText(resume.filePath, resume.fileType);
    } catch (extractError) {
      return res.status(422).json({ success: false, message: `Unable to extract text: ${extractError.message}` });
    }

    const normalizedRole = jobRole ? jobRole.toLowerCase().trim() : "general";

    // Calculate all scores
    const keywordScore = calculateKeywordScore(extractedText, normalizedRole);
    const atsScore = calculateAtsScore(extractedText);
    const readabilityScore = calculateReadabilityScore(extractedText);
    const formattingScore = calculateFormattingScore(extractedText);
    const overallScore = calculateOverallScore(keywordScore, atsScore, readabilityScore, formattingScore);
    const missingKeywordsFromScoring = getMissingKeywords(extractedText, normalizedRole);

    // Generate local insights (always available)
    const localInsights = generateLocalInsights(
      { keywordScore, atsScore, readabilityScore, formattingScore },
      normalizedRole
    );

    // Call AI service
    let aiResult = { strengths: [], weaknesses: [], missingKeywords: [], suggestions: [], improvedSummary: "" };
    try {
      aiResult = await analyzeWithAI(extractedText);
      console.log("✅ AI analysis successful");
    } catch (aiError) {
      console.error("AI analysis failed gracefully:", aiError.message);
    }

    // Merge: AI results take priority, fill gaps with local insights
    const finalStrengths = aiResult.strengths.length > 0
      ? aiResult.strengths
      : localInsights.strengths;

    const finalWeaknesses = aiResult.weaknesses.length > 0
      ? aiResult.weaknesses
      : localInsights.weaknesses;

    const finalSuggestions = aiResult.suggestions.length > 0
      ? [...aiResult.suggestions, ...localInsights.suggestions.slice(0, 2)]
      : localInsights.suggestions;

    const mergedMissingKeywords = [
      ...new Set([
        ...missingKeywordsFromScoring.slice(0, 8),
        ...(aiResult.missingKeywords || []).slice(0, 5),
      ]),
    ];

    // Save analysis
    const analysis = await Analysis.create({
      resumeId: resume._id,
      jobRole: normalizedRole,
      overallScore,
      atsScore,
      keywordScore,
      readabilityScore,
      formattingScore,
      strengths: finalStrengths,
      weaknesses: finalWeaknesses,
      suggestions: finalSuggestions,
      missingKeywords: mergedMissingKeywords,
      aiSummary: aiResult.improvedSummary || "",
    });

    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully.",
      analysis,
    });
  } catch (error) {
    console.error("Analyze resume error:", error);
    return res.status(500).json({ success: false, message: "Server error during analysis.", error: error.message });
  }
};

/**
 * @route   GET /api/analysis/:id
 * @access  Protected
 */
const getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id).populate("resumeId");

    if (!analysis) {
      return res.status(404).json({ success: false, message: "Analysis not found." });
    }

    if (
      analysis.resumeId &&
      analysis.resumeId.userId.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    console.error("Get analysis error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching analysis.", error: error.message });
  }
};

/**
 * @route   GET /api/analysis/
 * @access  Protected
 */
const getUserAnalyses = async (req, res) => {
  try {
    const userResumes = await Resume.find({ userId: req.user.id }).select("_id");
    const resumeIds = userResumes.map((r) => r._id);

    const analyses = await Analysis.find({ resumeId: { $in: resumeIds } })
      .populate("resumeId", "fileName uploadedAt fileType")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: analyses.length, analyses });
  } catch (error) {
    console.error("Get user analyses error:", error);
    return res.status(500).json({ success: false, message: "Server error fetching analyses.", error: error.message });
  }
};

module.exports = { analyzeResume, getAnalysis, getUserAnalyses };
