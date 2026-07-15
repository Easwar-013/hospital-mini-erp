import {
  FaHospital,
  FaChartPie,
  FaCalendarCheck,
  FaUserPlus,
  FaSignOutAlt,
  FaBullhorn,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css"; // Reuse your existing CSS
import { useAuth } from "../../context/AuthContext";

const ReceptionistSidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaChartPie />,
      path: "/receptionist/dashboard",
    },
    {
      name: "Appointments",
      icon: <FaCalendarCheck />,
      path: "/receptionist/appointments",
    },
    {
      name: "Register Patient",
      icon: <FaUserPlus />,
      path: "/receptionist/register-patient",
    },
    {
      name: "Announcements",
      icon: <FaBullhorn />, // Import this from react-icons/fa
      path: "/receptionist/announcements",
    },
  ];

  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-circle">
          <FaHospital />
        </div>
        <div>
          <h2>Hospital ERP</h2>
          <p>Reception Portal</p>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
};

export default ReceptionistSidebar;
