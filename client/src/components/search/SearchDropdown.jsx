import "./SearchDropdown.css";

import {
  FaUserInjured,
  FaUserMd,
  FaCalendarCheck,
  FaBed,
  FaFileInvoiceDollar,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const SearchDropdown = ({ results, onClose }) => {
  const navigate = useNavigate();

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
            navigate(item.route);
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
