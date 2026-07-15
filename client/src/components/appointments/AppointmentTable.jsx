import { useState } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { deleteAppointment } from "../../services/appointmentService";
import "./AppointmentTable.css";

const AppointmentTable = ({ appointments, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteAppointment(id);
        toast.success("Appointment Deleted Successfully");
        onDelete();
      } catch (error) {
        toast.error(error.response?.data?.message || "Delete Failed");
      }
    }
  };

  const filteredAppointments = appointments.filter(
    (apt) =>
      (apt.patient?.fullName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (apt.doctor?.fullName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (apt.status || "").toLowerCase().includes(search.toLowerCase()),
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

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              // We sort the already filtered list to put the newest at the top
              [...filteredAppointments]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
                )
                .map((apt) => (
                  <tr key={apt._id}>
                    {/* Display the database-stored ID if available, otherwise fallback */}
                    <td>{apt.appointmentId || "N/A"}</td>
                    <td>{apt.patient?.fullName || "N/A"}</td>
                    <td>{apt.doctor?.fullName || "N/A"}</td>
                    <td>{apt.appointmentDate}</td>
                    <td>{apt.appointmentTime}</td>
                    <td>
                      <span className="status admitted">{apt.status}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit" onClick={() => onEdit(apt)}>
                          <FaEdit />
                        </button>
                        <button
                          className="delete"
                          onClick={() => handleDelete(apt._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Appointments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;
