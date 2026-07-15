import api from "../../services/axios"; // Adjust path if your axios config is elsewhere

// ==========================================
// REGISTRATION & LOGIN
// ==========================================

// Standard Register
export const registerUser = async (userData) => {
  const response = await api.post("/patient-user/register", userData);
  return response.data;
};

// Standard Email Login
export const loginUser = async (loginData) => {
  const response = await api.post("/patient-user/login", loginData);
  return response.data;
};

// NEW: Google Login
export const googleLoginUser = async (googleData) => {
  const response = await api.post("/patient-user/google-login", googleData);
  return response.data;
};

// NEW: Phone OTP Login
export const phoneLoginUser = async (phoneData) => {
  const response = await api.post("/patient-user/phone-login", phoneData);
  return response.data;
};

// ==========================================
// USER PROFILE & APPOINTMENTS
// ==========================================

// Profile
export const getUserProfile = async () => {
  const response = await api.get("/patient-user/profile"); // Interceptor adds token
  return response.data;
};

// Book Appointment
// Update these functions in src/user/services/userService.js
export const bookAppointment = async (data) => {
  // REMOVED manual token retrieval and header injection
  const response = await api.post("/patient-user/book-appointment", data);
  return response.data;
};

export const getMyAppointments = async () => {
  // REMOVED manual token retrieval and header injection
  const response = await api.get("/patient-user/my-appointments");
  return response.data.appointments; 
};