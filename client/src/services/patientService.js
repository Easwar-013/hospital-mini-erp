import api from "./axios";

// Get All Patients
export const getPatients = async () => {
  const response = await api.get("/patients");
  return response.data.patients;
};

// Add Patient
export const addPatient = async (patientData) => {
  const response = await api.post("/patients", patientData);
  return response.data;
};

// Update Patient
export const updatePatient = async (id, patientData) => {
  const response = await api.put(`/patients/${id}`, patientData);
  return response.data;
};

// Delete Patient
export const deletePatient = async (id) => {
  const response = await api.delete(`/patients/${id}`);
  return response.data;
};