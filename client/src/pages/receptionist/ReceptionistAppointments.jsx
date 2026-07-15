import { useEffect, useState } from "react";
import { getAppointments } from "../../services/appointmentService"; // Ensure this path is correct
import "./ReceptionistAppointments.css";
const ReceptionistAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to fetch appointments");
    }
  };

  return (
    <div className="admin-content">
      <div className="receptionist-page-header">
        <h1>Appointments</h1>
      </div>

      <table className="appointments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Doctor</th>
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
                <td>{apt.appointmentId}</td>
                <td>{apt.patient?.fullName || "N/A"}</td>
                <td>{apt.doctor?.fullName || "N/A"}</td>
                <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                <td>{apt.status}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReceptionistAppointments;
