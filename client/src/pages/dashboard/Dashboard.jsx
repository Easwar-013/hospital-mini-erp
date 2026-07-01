import "./Dashboard.css";

import {
  FaUserInjured,
  FaUserMd,
  FaCalendarCheck,
  FaBed,
} from "react-icons/fa";

import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import Announcements from "../../components/dashboard/Announcements";

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Welcome Banner */}

      <div className="welcome-banner">
        <div>
          <h1>Welcome Back 👋</h1>

          <p>
            Hospital Management Mini ERP helps you manage patients, appointments
            and billing from one place.
          </p>
        </div>
      </div>

      {/* Cards */}

      <div className="card-grid">
        <StatCard
          title="Patients"
          value="245"
          icon={<FaUserInjured />}
          color="#2563EB"
        />

        <StatCard
          title="Doctors"
          value="18"
          icon={<FaUserMd />}
          color="#10B981"
        />

        <StatCard
          title="Appointments"
          value="36"
          icon={<FaCalendarCheck />}
          color="#F59E0B"
        />

        <StatCard
          title="Available Beds"
          value="32"
          icon={<FaBed />}
          color="#8B5CF6"
        />
      </div>

      {/* Bottom */}

      {/* Bottom */}

      <div className="dashboard-row">
        <QuickActions />

        <Announcements />
      </div>

      <div className="dashboard-row">
        <div className="dashboard-box">
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
              <tr>
                <td>Rahul Kumar</td>
                <td>25</td>
                <td>
                  <span className="badge admitted">Admitted</span>
                </td>
              </tr>

              <tr>
                <td>Priya Sharma</td>
                <td>34</td>
                <td>
                  <span className="badge discharged">Discharged</span>
                </td>
              </tr>

              <tr>
                <td>Arun Raj</td>
                <td>40</td>
                <td>
                  <span className="badge admitted">Admitted</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="dashboard-box">
          <h3>Today's Schedule</h3>

          <ul className="appointment-list">
            <li>09:00 AM - OP Consultation</li>

            <li>10:30 AM - Dr. John</li>

            <li>12:00 PM - Blood Test</li>

            <li>02:00 PM - MRI Scan</li>

            <li>04:30 PM - Billing Review</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
