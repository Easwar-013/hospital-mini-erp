import "./Sidebar.css";
import {
  FaHome,
  FaCalendarCheck,
  FaClipboardList,
  FaFileInvoiceDollar,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";

import { NavLink, Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");

    navigate("/user/login");
  };

  return (
    <aside className="user-sidebar">
      {/* Logo */}

      <div className="user-logo">
        🏥
        <h2>City Hospital</h2>
      </div>

      {/* Menu */}

      <nav>
        <NavLink to="/user/dashboard">
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink to="/user/book-appointment">
          <FaCalendarCheck />
          Book Appointment
        </NavLink>

        <NavLink to="/user/my-appointments">
          <FaClipboardList />
          My Appointments
        </NavLink>

        <NavLink to="/user/bills">
          <FaFileInvoiceDollar />
          Bills
        </NavLink>
      </nav>

      {/* Bottom Buttons */}

      <div className="sidebar-footer">

        <button className="logout-btn" onClick={logout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
