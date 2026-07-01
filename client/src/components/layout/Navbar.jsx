import "./Navbar.css";
import { useLocation } from "react-router-dom";

import { FaBell, FaSearch, FaChevronDown } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/patients": "Patients",
    "/doctors": "Doctors",
    "/appointments": "Appointments",
    "/wards": "Ward Management",
    "/billing": "Billing",
    "/settings": "Settings",
  };

  const pageTitle = pageTitles[location.pathname] || "Hospital ERP";
  
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2>{pageTitle}</h2>
        <span>{today}</span>
      </div>

      <div className="navbar-center">
        <div className="search-box">
          <FaSearch className="search-icon" />

          <input type="text" placeholder="Search patients, doctors..." />
        </div>
      </div>

      <div className="navbar-right">
        <button className="notification-btn">
          <FaBell />

          <span className="notification-count">3</span>
        </button>

        <div className="navbar-profile">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff"
            alt="Admin"
          />

          <div>
            <h4>Administrator</h4>

            <p>System Admin</p>
          </div>

          <FaChevronDown />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
