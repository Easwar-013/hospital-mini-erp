import "./PatientTable.css";
import { useState } from "react";

import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { deletePatient } from "../../services/patientService";

const PatientTable = ({ patients = [], onEdit, onDelete }) => {

  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter((patient) => {
    const keyword = search.toLowerCase();

    return (
      patient.patientId?.toLowerCase().includes(keyword) ||
      patient.fullName?.toLowerCase().includes(keyword) ||
      patient.phone?.includes(search) ||
      patient.gender?.toLowerCase().includes(keyword) ||
      patient.status?.toLowerCase().includes(keyword)
    );
  });

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?",
    );

    if (!confirmDelete) return;

    try {
      await deletePatient(id);

      toast.success("Patient Deleted Successfully");

      onDelete();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete Failed");
    }
  };
  return (
    <div className="patient-table">
      <div className="table-header">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Doctor</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredPatients.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No Patients Found
              </td>
            </tr>
          ) : (
            filteredPatients.map((patient) => (
              <tr key={patient._id}>
                <td>{patient.patientId}</td>

                <td>{patient.fullName}</td>

                <td>{patient.age}</td>

                <td>{patient.gender}</td>

                <td>{patient.phone}</td>

                <td>{patient.doctor?.fullName || "-"}</td>

                <td>
                  <span
                    className={
                      patient.status === "Admitted"
                        ? "status admitted"
                        : "status discharged"
                    }
                  >
                    {patient.status}
                  </span>
                </td>

                <td>
                  <button className="edit" onClick={() => onEdit(patient)}>
                    <FaEdit />
                  </button>

                  <button
                    className="delete"
                    onClick={() => handleDelete(patient._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
