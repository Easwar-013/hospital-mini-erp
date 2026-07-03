import "./QuickActions.css";
import { useNavigate } from "react-router-dom";

import {
  FaUserPlus,
  FaUserMd,
  FaCalendarPlus,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-box">
      <h3>Quick Actions</h3>

      <div className="quick-grid">
        <div
          className="quick-card"
          onClick={() => navigate("/patients?add=true")}
        >
          <FaUserPlus />
          <span>Add Patient</span>
        </div>

        <div
          className="quick-card"
          onClick={() => navigate("/doctors?add=true")}
        >
          <FaUserMd />
          <span>Add Doctor</span>
        </div>

        <div
          className="quick-card"
          onClick={() => navigate("/appointments?add=true")}
        >
          <FaCalendarPlus />
          <span>Appointment</span>
        </div>

        <div
          className="quick-card"
          onClick={() => navigate("/billing?add=true")}
        >
          <FaFileInvoiceDollar />
          <span>Billing</span>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
