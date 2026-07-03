import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import "./Doctors.css";

import DoctorTable from "../../components/doctors/DoctorTable";
import AddDoctorModal from "../../components/doctors/AddDoctorModal";
import { useSearchParams } from "react-router-dom";
import { getDoctors } from "../../services/doctorService";

const Doctors = () => {
  const [openModal, setOpenModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchParams] = useSearchParams();

  const fetchDoctors = async () => {
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (error) {
      toast.error("Failed to load doctors");
    }
  };

  useEffect(() => {
    fetchDoctors();

    if (searchParams.get("add") === "true") {
      setSelectedDoctor(null);
      setOpenModal(true);
    }
  }, []);

  return (
    <div className="doctors-page">
      <div className="page-header">
        <div>
          <h1>Doctors</h1>
          <p>Manage hospital doctors and specialists.</p>
        </div>

        <button
          className="add-btn"
          onClick={() => {
            setSelectedDoctor(null);
            setOpenModal(true);
          }}
        >
          <FaPlus />
          Add Doctor
        </button>
      </div>

      <DoctorTable
        doctors={doctors}
        onEdit={(doctor) => {
          setSelectedDoctor(doctor);
          setOpenModal(true);
        }}
        onDelete={fetchDoctors}
      />

      <AddDoctorModal
        isOpen={openModal}
        selectedDoctor={selectedDoctor}
        onClose={() => {
          setOpenModal(false);
          setSelectedDoctor(null);
        }}
        onDoctorSaved={fetchDoctors}
      />
    </div>
  );
};

export default Doctors;
