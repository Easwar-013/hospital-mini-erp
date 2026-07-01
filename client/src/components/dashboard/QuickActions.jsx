import "./QuickActions.css";

import {
  FaUserPlus,
  FaUserMd,
  FaCalendarPlus,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const QuickActions = () => {
  return (
    <div className="dashboard-box">
      <h3>Quick Actions</h3>

      <div className="quick-grid">
        <button className="quick-btn">
          <FaUserPlus />
          <span>Add Patient</span>
        </button>

        <button className="quick-btn">
          <FaUserMd />
          <span>Add Doctor</span>
        </button>

        <button className="quick-btn">
          <FaCalendarPlus />
          <span>Appointment</span>
        </button>

        <button className="quick-btn">
          <FaFileInvoiceDollar />
          <span>Billing</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
