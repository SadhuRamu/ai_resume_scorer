import api from "./api";

export const analyzeResume = (resumeId, jobRole) =>
  api.post("/analysis/", { resumeId, jobRole });

export const getAnalysis = (id) => api.get(`/analysis/${id}`);

export const getUserAnalyses = () => api.get("/analysis/");
