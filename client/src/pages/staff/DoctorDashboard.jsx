import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/axios";
import "./StaffDashboard.css";
import { getDoctorDashboardStats } from "../../services/doctorService";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const userString = localStorage.getItem("user");
  const doctor = userString ? JSON.parse(userString) : null;

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getDoctorDashboardStats();
      setAppointments(data.appointments);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctor?.id) fetchAppointments();
  }, [doctor?.id]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/appointments/${id}`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (!doctor) return <div>Please login to continue...</div>;

  return (
    <div className="staff-dashboard-container">
      {/* Modern Welcome Banner */}
      <div className="welcome-banner">
        <h1>
          Welcome Back, Dr. {doctor?.fullName || doctor?.name || "Doctor"} 
        </h1>
        <p>Manage your appointments and patient schedules from one place.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Appointments</h3>
          <p>{appointments.length}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p>
            {appointments.filter((a) => a.status.includes("Pending")).length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p>{appointments.filter((a) => a.status === "Completed").length}</p>
        </div>
      </div>

      <div className="appointments-grid">
        {loading ? (
          <p>Fetching appointments...</p>
        ) : (
          // .slice().reverse() ensures the newest appointments are displayed first
          appointments
            .slice()
            .reverse()
            .map((apt) => (
              <div
                key={apt._id}
                className={`appointment-card ${apt.status.toLowerCase().replace(" ", "-")}`}
              >
                <div className="apt-header">
                  <h3>{apt.patient?.fullName || "Unknown Patient"}</h3>
                  <span
                    className={`status-badge ${apt.status.toLowerCase().replace(" ", "-")}`}
                  >
                    {apt.status}
                  </span>
                </div>
                <div className="apt-body">
                  <p>
                    <strong>Date:</strong> {apt.appointmentDate?.split("T")[0]}
                  </p>
                  <p>
                    <strong>Time:</strong> {apt.appointmentTime || "N/A"}
                  </p>
                  <p>
                    <strong>Reason:</strong> {apt.reason}
                  </p>
                </div>
                <div className="apt-actions">
                  {apt.status !== "Completed" && (
                    <button
                      className="btn-complete"
                      onClick={() => handleUpdateStatus(apt._id, "Completed")}
                    >
                      ✅ Complete
                    </button>
                  )}
                  {(apt.status === "Pending" ||
                    apt.status === "Pending Approval") && (
                    <button
                      className="btn-accept"
                      onClick={() => handleUpdateStatus(apt._id, "Scheduled")}
                    >
                      📅 Accept
                    </button>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
