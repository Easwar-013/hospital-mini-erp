import { useState, useEffect } from "react";
import api from "../../services/axios";
import { toast } from "react-toastify";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        // Assuming you have a route that returns all appointments for the doctor
        const response = await api.get("/appointments/doctor-dashboard");
        setAppointments(response.data.appointments);
      } catch (error) {
        toast.error("Failed to fetch appointments");
      }
    };
    fetchAllAppointments();
  }, []);

  return (
    <div className="staff-dashboard-container">
      <h1>All Appointments</h1>
      <table className="appointments-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {[...appointments]
            .sort(
              (a, b) =>
                new Date(b.appointmentDate) - new Date(a.appointmentDate),
            )
            .map((apt) => (
              <tr key={apt._id}>
                <td>{apt.patient?.fullName || apt.patientName || "N/A"}</td>
                <td>{apt.appointmentDate?.split("T")[0]}</td>
                <td>{apt.status}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;
