import api from "./axios";

// Get All Wards
export const getWards = async () => {
  const response = await api.get("/wards");
  return response.data.wards;
};

// Add Ward
export const addWard = async (wardData) => {
  const response = await api.post("/wards", wardData);
  return response.data;
};

// Update Ward
export const updateWard = async (id, wardData) => {
  const response = await api.put(`/wards/${id}`, wardData);
  return response.data;
};

// Delete Ward
export const deleteWard = async (id) => {
  const response = await api.delete(`/wards/${id}`);
  return response.data;
};