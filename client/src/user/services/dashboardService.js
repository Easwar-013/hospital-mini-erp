import api from "../../services/axios"; // Ensure this path is correct

export const getDashboard = async () => {
  // The interceptor in axios.js will automatically add the token
  const response = await api.get("/patient-user/dashboard");
  return response.data;
};