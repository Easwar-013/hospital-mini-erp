import api from "../../services/axios";

// Register
export const registerUser = async (userData) => {
  const response = await api.post("/patient-user/register", userData);
  return response.data;
};

// Login
export const loginUser = async (loginData) => {
  const response = await api.post("/patient-user/login", loginData);
  return response.data;
};

// Profile
export const getUserProfile = async (token) => {
  const response = await api.get("/patient-user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const bookAppointment = async (data) => {
  const token = localStorage.getItem("patientToken");

  const response = await api.post(
    "/patient-user/book-appointment",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getMyAppointments = async () => {
  const token = localStorage.getItem("patientToken");

  const response = await api.get(
    "/patient-user/my-appointments",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // FIX: Drill down one more level to return just the array!
  return response.data.appointments; 
};