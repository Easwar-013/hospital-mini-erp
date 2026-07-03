import api from "./axios";

// ================================
// Get All Appointments
// ================================
export const getAppointments = async () => {
  const response = await api.get("/appointments");
  return response.data.appointments;
};

// ================================
// Add Appointment
// ================================
export const addAppointment = async (appointmentData) => {
  const response = await api.post("/appointments", appointmentData);
  return response.data;
};

// ================================
// Update Appointment
// ================================
export const updateAppointment = async (id, appointmentData) => {
  const response = await api.put(`/appointments/${id}`, appointmentData);
  return response.data;
};

// ================================
// Delete Appointment
// ================================
export const deleteAppointment = async (id) => {
  const response = await api.delete(`/appointments/${id}`);
  return response.data;
};