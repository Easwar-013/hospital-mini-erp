import axios from "axios";

const api = axios.create({
  baseURL: "https://hospital-mini-erp.onrender.com/api",
});

// Add this interceptor to attach the token automatically
api.interceptors.request.use((config) => {
  if (!config.url.includes('/auth/login') && !config.url.includes('/staff/login')) {
  const token = localStorage.getItem("token") || localStorage.getItem("patientToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;