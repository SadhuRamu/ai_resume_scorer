const axios = require("axios");

const DEFAULT_FALLBACK = {
  strengths: [],
  weaknesses: [],
  missingKeywords: [],
  suggestions: [],
  improvedSummary: "",
};

const analyzeWithAI = async (resumeText) => {
  try {
    if (!process.env.GROK_API_KEY || process.env.GROK_API_KEY === "YOUR_GROK_API_KEY_HERE") {
      console.warn("⚠️  No AI API key set — skipping AI analysis");
      return DEFAULT_FALLBACK;
    }

    const response = await axios.post(
      process.env.GROK_API_URL,
      {
        model: process.env.GROK_MODEL || "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are an expert resume reviewer. Always respond ONLY with valid raw JSON. No markdown. No explanation. No code blocks. No comments.",
          },
          {
            role: "user",
            content: `Analyze this resume and respond ONLY in this exact JSON format with no extra text whatsoever:
{
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "weaknesses": ["specific weakness 1", "specific weakness 2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3"],
  "improvedSummary": "A professionally rewritten 2-3 sentence summary for this candidate."
}

Resume Text:
${resumeText.slice(0, 3000)}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    let content = response.data.choices[0].message.content;

    // Strip any markdown code fences if present
    content = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

    // Extract JSON if there's surrounding text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) content = jsonMatch[0];

    const parsed = JSON.parse(content);

    return {
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      improvedSummary: typeof parsed.improvedSummary === "string" ? parsed.improvedSummary : "",
    };
  } catch (error) {
    const status = error.response?.status;
    const errMsg = error.response?.data?.error?.message || error.message;
    console.error(`❌ AI analysis error [${status || "NETWORK"}]: ${errMsg}`);
    return DEFAULT_FALLBACK;
  }
};

module.exports = { analyzeWithAI };
