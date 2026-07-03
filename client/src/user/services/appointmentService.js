import api from "../../services/axios";

export const bookAppointment = async (appointmentData) => {
  const token = localStorage.getItem("patientToken");

  const response = await api.post(
    "/patient-user/book-appointment",
    appointmentData,
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

  return response.data.appointments;
};

export const getMyBills = async () => {
  const token = localStorage.getItem("patientToken");

  const response = await api.get("/patient-user/my-bills", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.bills;
};