import api from "./axios";

export const getPatients = async () => {
  const response = await api.get("/patients");
  return response.data;
};

export const addPatient = async (patientData) => {
  const response = await api.post("/patients", patientData);
  return response.data;
};

export const updatePatient = async (id, patientData) => {
  const response = await api.put(`/patients/${id}`, patientData);
  return response.data;
};

export const deletePatient = async (id) => {
  const response = await api.delete(`/patients/${id}`);
  return response.data;
};