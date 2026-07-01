import "./Announcements.css";

const Announcements = () => {
  return (
    <div className="dashboard-box">
      <h3>Hospital Announcements</h3>

      <ul className="announcement-list">
        <li>📢 OPD closes at 6:00 PM today.</li>

        <li>🩸 Blood Donation Camp on Friday.</li>

        <li>👨‍⚕️ Staff Meeting tomorrow at 10:00 AM.</li>

        <li>💊 Pharmacy stock verification this weekend.</li>
      </ul>
    </div>
  );
};

export default Announcements;
