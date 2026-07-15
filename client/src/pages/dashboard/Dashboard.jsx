import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Dashboard.css";
import {
  FaUserInjured,
  FaUserMd,
  FaCalendarCheck,
  FaBed,
  FaUserTie,
} from "react-icons/fa";
import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import Announcements from "../../components/dashboard/Announcements";
import { getDashboard } from "../../services/dashboardService";

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [receptionists, setReceptionists] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [availableBeds, setAvailableBeds] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await getDashboard();
      const appointmentsToShow =
        data.todayAppointments && data.todayAppointments.length > 0
          ? data.todayAppointments
          : data.appointments || [];
      console.log("Dashboard API Response:", data);
      setPatients(data.recentPatients || []);
      setDoctors(data.totalDoctors ? new Array(data.totalDoctors) : []);
      setReceptionists(data.totalReceptionists || 0);
      setAppointments(data.todayAppointments || []);
      setAvailableBeds(data.availableBeds);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    }
  };

  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Get today's date in YYYY-MM-DD format to match your API date format
  const today = new Date().toISOString().split("T")[0];

  // Remove the .filter() logic entirely
  const todaySchedule = [...appointments]
    .filter((a) => {
      if (!a.appointmentDate) return false;

      // Extract the date part from your API's ISO format
      const aptDateString = new Date(a.appointmentDate)
        .toISOString()
        .split("T")[0];

      // Log for debugging
      console.log(`Comparing: ${aptDateString} === ${today}`);

      // Return true only if the dates match
      return aptDateString === today;
    })
    .sort((a, b) =>
      (a.appointmentTime || "00:00").localeCompare(
        b.appointmentTime || "00:00",
      ),
    )
    .slice(0, 5);

  return (
    <div className="admin-dashboard">
      <div className="admin-welcome-banner">
        <h1>Welcome Back </h1>
        <p>
          Hospital Management Mini ERP helps you manage patients, appointments
          and billing from one place.
        </p>
      </div>

      <div className="admin-card-grid">
        <StatCard
          title="Patients"
          value={patients.length}
          icon={<FaUserInjured />}
          color="#2563EB"
        />
        <StatCard
          title="Doctors"
          value={doctors.length}
          icon={<FaUserMd />}
          color="#10B981"
        />
        <StatCard
          title="Receptionists"
          value={receptionists} // Remove .length here, just use the number directly
          icon={<FaUserTie />}
          color="#EC4899"
        />
        <StatCard
          title="Appointments"
          value={appointments.length}
          icon={<FaCalendarCheck />}
          color="#F59E0B"
        />
        <StatCard
          title="Available Beds"
          value={availableBeds}
          icon={<FaBed />}
          color="#8B5CF6"
        />
      </div>

      <div className="admin-dashboard-row">
        <QuickActions />
        <Announcements />
      </div>

      <div className="admin-dashboard-row">
        <div className="admin-dashboard-box">
          <h3>Recent Patients</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((p) => (
                <tr key={p._id}>
                  <td>{p.fullName}</td>
                  <td>{p.age}</td>
                  <td>
                    <span className={`badge ${p.status.toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-dashboard-box">
          <h3>Today's Schedule</h3>
          <ul className="admin-appointment-list">
            {todaySchedule.length > 0 ? (
              todaySchedule.map((a) => (
                <li key={a._id}>
                  <span className="apt-date">
                    {new Date(a.appointmentDate).toLocaleDateString()}
                  </span>
                  <span className="apt-name">
                    {a.patient?.fullName || "Patient"}
                  </span>
                </li>
              ))
            ) : (
              <li>No Appointments</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};;;
export default Dashboard;
