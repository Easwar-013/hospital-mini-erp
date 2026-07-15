import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  getAnnouncements,
  deleteAnnouncement,
} from "../../services/announcementService";
import AnnouncementModal from "../../components/announcements/AddAnnouncementModal";
import "./ReceptionistAnnouncements.css";

const ReceptionistAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const data = await getAnnouncements();
    setAnnouncements(data || []);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this announcement?")) {
      await deleteAnnouncement(id);
      fetchAll();
    }
  };

  return (
    <div className="receptionist-content">
      <div className="receptionist-header-row">
        <h1>Announcements</h1>
        <button
          className="add-btn"
          onClick={() => {
            setSelectedAnnouncement(null);
            setIsModalOpen(true);
          }}
        >
          + Add Announcement
        </button>
      </div>

      <table className="receptionist-table">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Title</th>
            <th>Message</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((a) => (
            <tr key={a._id}>
              <td>{a.icon}</td>
              <td>{a.title}</td>
              <td>{a.message}</td>
              <td>
                <span
                  className={`badge ${
                    a.status === "Active" ||
                    a.status === "active" ||
                    a.active === true
                      ? "admitted"
                      : "discharged"
                  }`}
                >
                  {a.status || (a.active ? "Active" : "Inactive")}
                </span>
              </td>
              <td>
                <button
                  onClick={() => {
                    setSelectedAnnouncement(a);
                    setIsModalOpen(true);
                  }}
                >
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(a._id)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selected={selectedAnnouncement}
        onSaved={fetchAll}
      />
    </div>
  );
};
export default ReceptionistAnnouncements;
