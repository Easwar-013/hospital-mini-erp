import api from "./axios";

// Get All Doctors
export const getDoctorDashboardStats = async () => {
  const response = await api.get("/appointments/doctor-dashboard");
  return response.data; // Ensure this matches what your backend returns
};

export const getDoctors = async () => {
 const response = await api.get("/doctors");
  return response.data.doctors;
};

// Add Doctor
export const addDoctor = async (doctorData) => {
  const response = await api.post("/doctors", doctorData);
  return response.data;
};

// Update Doctor
export const updateDoctor = async (id, doctorData) => {
  const response = await api.put(`/doctors/${id}`, doctorData);
  return response.data;
};

// Delete Doctor
export const deleteDoctor = async (id) => {
  const response = await api.delete(`/doctors/${id}`);
  return response.data;
};