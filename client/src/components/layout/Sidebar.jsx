import {
  FaHospital,
  FaChartPie,
  FaUserInjured,
  FaUserMd,
  FaCalendarCheck,
  FaBed,
  FaFileInvoiceDollar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaBullhorn } from "react-icons/fa";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: <FaChartPie />, path: "/dashboard" },
    { name: "Patients", icon: <FaUserInjured />, path: "/patients" },
    { name: "Doctors", icon: <FaUserMd />, path: "/doctors" },
    { name: "Appointments", icon: <FaCalendarCheck />, path: "/appointments" },
    { name: "Ward Management", icon: <FaBed />, path: "/wards" },
    { name: "Billing", icon: <FaFileInvoiceDollar />, path: "/billing" },
    {
      name: "Announcements",
      path: "/announcements",
      icon: <FaBullhorn />,
    },
  ];
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      {/* Logo */}

      <div className="sidebar-logo">
        <div className="logo-circle">
          <FaHospital />
        </div>

        <div>
          <h2>Hospital ERP</h2>
          <p>Smart Healthcare</p>
        </div>
      </div>

      {/* Menu */}

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

      {/* Footer */}

      <div className="sidebar-footer">
        

        <button
          className="logout-btn"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
