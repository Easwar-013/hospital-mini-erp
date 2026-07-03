import api from "../../services/axios";

export const getDashboard = async () => {
  const token = localStorage.getItem("patientToken");

  const response = await api.get(
    "/patient-user/dashboard",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};