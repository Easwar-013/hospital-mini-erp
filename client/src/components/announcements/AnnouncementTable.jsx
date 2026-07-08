import { useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

import { deleteAnnouncement } from "../../services/announcementService";

import "./AnnouncementTable.css";

const AnnouncementTable = ({ announcements, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");

  const filteredAnnouncements = useMemo(() => {
    return (announcements || []).filter(
      (announcement) =>
        announcement.title.toLowerCase().includes(search.toLowerCase()) ||
        announcement.message.toLowerCase().includes(search.toLowerCase()),
    );
  }, [announcements, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;

    try {
      await deleteAnnouncement(id);

      toast.success("Announcement Deleted Successfully");

      onDelete();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to Delete Announcement",
      );
    }
  };

  return (
    <div className="table-card">
      <div className="table-header">
        <input
          className="table-search"
          type="text"
          placeholder="Search announcement..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="custom-table">
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
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => (
                <tr key={announcement._id}>
                  <td style={{ fontSize: "22px" }}>{announcement.icon}</td>

                  <td>{announcement.title}</td>

                  <td>{announcement.message}</td>

                  <td>
                    <span
                      className={`badge ${
                        announcement.active ? "admitted" : "discharged"
                      }`}
                    >
                      {announcement.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => onEdit(announcement)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(announcement._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No Announcements Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnnouncementTable;
