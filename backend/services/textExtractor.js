const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const extractText = async (filePath, fileType) => {
  try {
    if (fileType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      if (!data.text || data.text.trim().length === 0) {
        throw new Error("Could not extract text from PDF. The file may be image-based.");
      }
      return data.text;
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      if (!result.value || result.value.trim().length === 0) {
        throw new Error("Could not extract text from DOCX file.");
      }
      return result.value;
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    throw new Error(`Text extraction failed: ${error.message}`);
  }
};

module.exports = { extractText };
