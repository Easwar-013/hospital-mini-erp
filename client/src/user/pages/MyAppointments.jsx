import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyAppointments } from "../services/appointmentService";
import "./MyAppointments.css";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error("Failed to load appointments");
    }
  };

  return (
    <div className="my-appointments-page">
      <h1>My Appointments</h1>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        /* Added responsive wrapper here */
        <div className="table-responsive">
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.appointmentId}</td>

                  <td>{appointment.doctor?.fullName}</td>

                  <td>
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </td>

                  <td>{appointment.appointmentTime}</td>

                  <td>{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
