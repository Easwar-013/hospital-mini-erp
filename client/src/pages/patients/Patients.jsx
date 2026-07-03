import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import "./Patients.css";

import PatientTable from "../../components/patients/PatientTable";
import AddPatientModal from "../../components/patients/AddPatientModal";
import { useSearchParams } from "react-router-dom";

import { getPatients } from "../../services/patientService";

const Patients = () => {
  const [openModal, setOpenModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchParams] = useSearchParams();

  // Load patients
  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      toast.error("Failed to load patients");
    }
  };

  useEffect(() => {
    fetchPatients();

    if (searchParams.get("add") === "true") {
      setSelectedPatient(null);
      setOpenModal(true);
    }
  }, []);

  return (
    <div className="patients-page">
      <div className="page-header">
        <div>
          <h1>Patients</h1>
          <p>Manage all patient records.</p>
        </div>

        <button className="add-btn" onClick={() => setOpenModal(true)}>
          <FaPlus />
          Add Patient
        </button>
      </div>

      <PatientTable
        patients={patients}
        onEdit={(patient) => {
          setSelectedPatient(patient);
          setOpenModal(true);
        }}
        onDelete={fetchPatients}
      />

      <AddPatientModal
        isOpen={openModal}
        selectedPatient={selectedPatient}
        onClose={() => {
          setOpenModal(false);
          setSelectedPatient(null);
        }}
        onPatientSaved={fetchPatients}
      />
    </div>
  );
};

export default Patients;
