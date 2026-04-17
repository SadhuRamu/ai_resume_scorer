import api from "./api";

export const uploadResume = (formData) =>
  api.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getResume = (id) => api.get(`/resume/${id}`);

export const getUserResumes = () => api.get("/resume/");
