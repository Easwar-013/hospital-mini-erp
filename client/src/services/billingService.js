import api from "./axios";

// ===============================
// Get All Bills
// ===============================
export const getBills = async () => {
  const response = await api.get("/billing");
  return response.data.bills;
};

// ===============================
// Create Bill
// ===============================
export const addBill = async (billData) => {
  const response = await api.post("/billing", billData);
  return response.data;
};

// ===============================
// Update Bill
// ===============================
export const updateBill = async (id, billData) => {
  const response = await api.put(`/billing/${id}`, billData);
  return response.data;
};

// ===============================
// Delete Bill
// ===============================
export const deleteBill = async (id) => {
  const response = await api.delete(`/billing/${id}`);
  return response.data;
};