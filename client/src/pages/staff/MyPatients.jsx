import { useState, useEffect } from "react";
import api from "../../services/axios";
import { toast } from "react-toastify";

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndExtractPatients = async () => {
      try {
        setLoading(true);
        // Use the existing working endpoint
        const response = await api.get("/appointments/doctor-dashboard");

        // Extract unique patients from the appointments list
        const allAppointments = response.data.appointments || [];

        // Create a Map to store unique patients by ID
        const uniquePatientsMap = new Map();
        allAppointments.forEach((apt) => {
          if (apt.patient && apt.patient._id) {
            uniquePatientsMap.set(apt.patient._id, apt.patient);
          }
        });

        // Update your console.log in MyPatients.jsx
        console.log(
          "Patient Data Object:",
          Array.from(uniquePatientsMap.values()),
        );

        setPatients(Array.from(uniquePatientsMap.values()));
      } catch (error) {
        toast.error("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };

    fetchAndExtractPatients();
  }, []);

  return (
    <div className="staff-dashboard-container">
      <h1>My Patients</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient._id}>
                  <td>{patient.fullName || "Unknown"}</td>
                  <td>{patient.user?.email || "N/A"}</td>
                  <td>{patient.phone || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyPatients;
