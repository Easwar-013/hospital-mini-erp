import "./SearchDropdown.css";

import {
  FaUserInjured,
  FaUserMd,
  FaCalendarCheck,
  FaBed,
  FaFileInvoiceDollar,
} from "react-icons/fa";

import { useNavigate, useLocation } from "react-router-dom";

const SearchDropdown = ({ results, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const rolePrefix = location.pathname.split("/")[1];

  const getIcon = (type) => {
    switch (type) {
      case "Patient":
        return <FaUserInjured className="search-type-icon patient" />;
      case "Doctor":
        return <FaUserMd className="search-type-icon doctor" />;
      case "Appointment":
        return <FaCalendarCheck className="search-type-icon appointment" />;
      case "Ward":
        return <FaBed className="search-type-icon ward" />;
      case "Bill":
        return <FaFileInvoiceDollar className="search-type-icon bill" />;
      default:
        return null;
    }
  };

  if (results.length === 0) {
    return (
      <div className="search-dropdown">
        <p className="no-result">No Results Found</p>
      </div>
    );
  }

  return (
    <div className="search-dropdown">
      {results.map((item) => (
        <div
          key={item.type + item.id}
          className="search-item"
          onClick={() => {
            // 1. Remove leading slash from the item's route
            const cleanRoute = item.route.startsWith("/")
              ? item.route.substring(1)
              : item.route;

            // 2. Identify the role/prefix properly
            // If the user is on /dashboard, rolePrefix becomes 'dashboard', which is wrong.
            // We need to determine the prefix based on where they are or just use the route directly if it's admin.

            let targetPath;

            // If the path is an admin page, navigate to the route directly (e.g., /patients)
            // Check against your list of admin top-level routes
            const adminRoutes = [
              "dashboard",
              "patients",
              "doctors",
              "receptionists",
              "appointments",
              "billing",
              "settings",
              "wards",
              "announcements",
            ];

            if (adminRoutes.includes(cleanRoute)) {
              targetPath = `/${cleanRoute}`;
            } else {
              // Otherwise keep the role prefix logic
              targetPath = `/${rolePrefix}/${cleanRoute}`;
            }

            console.log("Navigating to:", targetPath);
            navigate(targetPath);
            onClose();
          }}
        >
          {getIcon(item.type)}

          <div className="search-info">
            <h4>{item.title}</h4>
            <span>{item.subtitle}</span>
          </div>

          <small>{item.type}</small>
        </div>
      ))}
    </div>
  );
};

export default SearchDropdown;
