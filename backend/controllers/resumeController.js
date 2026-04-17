const Resume = require("../models/Resume");

/**
 * @route   POST /api/resume/upload
 * @access  Protected
 */
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select a PDF or DOCX file.",
      });
    }

    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
    });

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully.",
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        filePath: resume.filePath,
        fileType: resume.fileType,
        uploadedAt: resume.uploadedAt,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during upload.",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/resume/:id
 * @access  Protected
 */
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching resume.",
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/resume/
 * @access  Protected
 */
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({
      uploadedAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Get user resumes error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching resumes.",
      error: error.message,
    });
  }
};

module.exports = { uploadResume, getResume, getUserResumes };
