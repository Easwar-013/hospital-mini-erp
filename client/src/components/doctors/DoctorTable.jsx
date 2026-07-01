import "./DoctorTable.css";

import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

import { deleteDoctor } from "../../services/doctorService";

const DoctorTable = ({ doctors, onEdit, onDelete }) => {
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?",
    );

    if (!confirmDelete) return;

    try {
      await deleteDoctor(id);

      toast.success("Doctor Deleted Successfully");

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

          <input type="text" placeholder="Search doctor..." />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Doctor ID</th>
            <th>Name</th>
            <th>Specialization</th>
            <th>Experience</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {doctors.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No Doctors Found
              </td>
            </tr>
          ) : (
            doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td>{doctor.doctorId}</td>

                <td>{doctor.fullName}</td>

                <td>{doctor.specialization}</td>

                <td>{doctor.experience} Years</td>

                <td>{doctor.phone}</td>

                <td>{doctor.email}</td>

                <td>
                  <span
                    className={
                      doctor.status === "Available"
                        ? "status admitted"
                        : "status discharged"
                    }
                  >
                    {doctor.status}
                  </span>
                </td>

                <td>
                  <button className="edit" onClick={() => onEdit(doctor)}>
                    <FaEdit />
                  </button>

                  <button
                    className="delete"
                    onClick={() => handleDelete(doctor._id)}
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

export default DoctorTable;
