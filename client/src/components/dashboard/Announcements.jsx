import { useEffect, useState } from "react";
import "./Announcements.css";

import { getAnnouncements } from "../../services/announcementService";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await getAnnouncements();

      // Show only active announcements
      setAnnouncements(
        (data || []).filter((announcement) => announcement.active),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-box">
      <h3>Hospital Announcements</h3>

      <ul className="announcement-list">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <li key={announcement._id}>
              <span style={{ marginRight: "8px" }}>{announcement.icon}</span>

              <strong>{announcement.title}</strong>

              <br />

              <span
                style={{
                  color: "#64748B",
                  fontSize: "14px",
                }}
              >
                {announcement.message}
              </span>
            </li>
          ))
        ) : (
          <li>No announcements available.</li>
        )}
      </ul>
    </div>
  );
};

export default Announcements;
