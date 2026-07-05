import { useState } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

import { deleteAppointment } from "../../services/appointmentService";

import "./AppointmentTable.css";

const AppointmentTable = ({ appointments, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?",
    );

    if (!confirmDelete) return;

    try {
      await deleteAppointment(id);

      toast.success("Appointment Deleted Successfully");

      onDelete();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete Failed");
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patient?.fullName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      appointment.doctor?.fullName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      appointment.status?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="patient-table">
      <div className="table-header">
        <div className="search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search appointment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Responsive Wrapper */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Appointments Found
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appointment, index) => (
                <tr key={appointment._id}>
                  <td>
                    APT
                    {String(index + 1).padStart(3, "0")}
                  </td>

                  <td>{appointment.patient?.fullName}</td>

                  <td>{appointment.doctor?.fullName}</td>

                  <td>{appointment.appointmentDate}</td>

                  <td>{appointment.appointmentTime}</td>

                  <td>
                    <span className="status admitted">
                      {appointment.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="edit"
                      onClick={() => onEdit(appointment)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete"
                      onClick={() => handleDelete(appointment._id)}
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
    </div>
  );
};

export default AppointmentTable;
