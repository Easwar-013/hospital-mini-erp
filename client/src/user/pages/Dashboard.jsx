import { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaFileInvoiceDollar,
  FaBell,
  FaBullhorn,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { getDashboard } from "../services/dashboardService";

import "./Dashboard.css";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }

  return (
    <div className="user-dashboard">
      {/* Welcome Card */}

      <div className="welcome-card">
        <div>
          <h1>Welcome, {dashboard?.patientName} 👋</h1>

          <p>
            Manage your appointments, bills and hospital services from one
            place.
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <FaCalendarCheck className="card-icon" />

          <h3>Appointments</h3>

          <h2>{dashboard?.appointmentCount}</h2>
        </div>

        <div className="dashboard-card">
          <FaFileInvoiceDollar className="card-icon" />

          <h3>Pending Bills</h3>

          <h2>₹{dashboard?.pendingBillAmount}</h2>
        </div>

        <div className="dashboard-card">
          <FaBell className="card-icon" />

          <h3>Notifications</h3>

          <h2>{dashboard?.notifications?.length}</h2>
        </div>
      </div>

      {/* Middle Section */}

      <div className="dashboard-grid">
        {/* Upcoming Appointment */}

        <div className="dashboard-box">
          <h2>
            <FaCalendarAlt /> Upcoming Appointment
          </h2>

          {dashboard?.upcomingAppointment ? (
            <>
              <div className="appointment-item">
                <FaUserMd />

                <div>
                  <strong>
                    {dashboard.upcomingAppointment.doctor?.fullName}
                  </strong>

                  <p>{dashboard.upcomingAppointment.doctor?.specialization}</p>
                </div>
              </div>

              <div className="appointment-item">
                <FaCalendarAlt />

                <span>
                  {new Date(
                    dashboard.upcomingAppointment.appointmentDate,
                  ).toLocaleDateString()}
                </span>
              </div>

              <div className="appointment-item">
                <FaClock />

                <span>{dashboard.upcomingAppointment.appointmentTime}</span>
              </div>

              <span className="status approved">
                {dashboard.upcomingAppointment.status}
              </span>
            </>
          ) : (
            <div className="empty-state">No Upcoming Appointment</div>
          )}
        </div>

        {/* Announcements */}

        <div className="dashboard-box">
          <h2>
            <FaBullhorn /> Hospital Announcements
          </h2>

          {dashboard?.announcements?.length > 0 ? (
            <ul className="announcement-list">
              {dashboard.announcements.map((item) => (
                <li key={item._id}>
                  <FaArrowRight />

                  <div>
                    <strong>{item.title}</strong>

                    <p>{item.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No announcements available.</p>
          )}
        </div>
      </div>

      {/* Notifications */}

      <div className="dashboard-box">
        <h2>
          <FaBell /> Recent Notifications
        </h2>

        {dashboard?.notifications?.length > 0 ? (
          <ul className="notification-list">
            {dashboard.notifications.map((item, index) => (
              <li key={index}>
                <span>{item.icon}</span>

                {item.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Notifications</p>
        )}
      </div>

      {/* Quick Actions */}

      <div className="quick-actions">
        <Link to="/user/book-appointment" className="action-btn">
          📅 Book Appointment
        </Link>

        <Link to="/user/my-appointments" className="action-btn">
          📋 My Appointments
        </Link>

        <Link to="/user/bills" className="action-btn">
          💳 Bills
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
