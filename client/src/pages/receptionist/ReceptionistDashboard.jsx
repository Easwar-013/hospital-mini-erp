import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ReceptionistDashboard.css";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaUserPlus,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import StatCard from "../../components/dashboard/StatCard";
import { getReceptionistDashboard } from "../../services/receptionistService";

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    unpaidBills: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await getReceptionistDashboard();
      console.log("Receptionist API Response:", response);

      if (response) {
        // Update stats
        if (response.stats) {
          setStats({
            todayAppointments: response.stats.todayAppointments,
            unpaidBills: response.stats.unpaidBills,
          });
        }

        // CRITICAL: Ensure you are accessing the arrays correctly.
        // If your API returns data like { patients: [...], appointments: [...] },
        // you must use those keys here:
        setPatients(response.recentPatients || response.patients || []);
        setAppointments(
          response.todayAppointments || response.appointments || [],
        );
      }
    } catch (err) {
      toast.error("Failed to load dashboard data");
    }
  };

  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const todaySchedule = [...appointments]
    .sort((a, b) =>
      (a.appointmentTime || "00:00").localeCompare(
        b.appointmentTime || "00:00",
      ),
    )
    .slice(0, 5);

  return (
    <div className="receptionist-dashboard">
      <div className="receptionist-welcome-banner">
        <h1>Receptionist Portal </h1>
        <p>
          Manage daily appointments, register new patients, and track billing
          status.
        </p>
      </div>

      <div className="receptionist-card-grid">
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments ?? 0}
          icon={<FaCalendarCheck />}
          color="#2563EB"
        />

        <StatCard
          title="Unpaid Bills"
          value={stats.unpaidBills}
          icon={<FaFileInvoiceDollar />}
          color="#EF4444"
        />
        <StatCard
          title="New Registration"
          value="+"
          icon={<FaUserPlus />}
          color="#10B981"
          onClick={() => navigate("/receptionist/register-patient")}
        />
      </div>
      <div className="receptionist-dashboard-row">
        {/* Recent Patients Table */}
        <div className="receptionist-dashboard-box">
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

        {/* Today's Schedule List */}
        <div className="receptionist-dashboard-box">
          <h3>Today's Schedule</h3>
          <ul className="receptionist-appointment-list">
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
};

export default ReceptionistDashboard;
