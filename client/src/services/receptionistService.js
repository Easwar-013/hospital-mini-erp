import api from "./axios"; // Ensure the path is correct
const API_URL = "https://hospital-mini-erp.onrender.com/api";

export const getReceptionists = () => api.get("/receptionists");

export const addReceptionist = (data) => api.post("/receptionists", data);

export const deleteReceptionist = (id) => api.delete(`/receptionists/${id}`);

export const getReceptionistDashboard = async () => {
  const response = await api.get("/receptionists/dashboard-stats");
  return response.data;
};

