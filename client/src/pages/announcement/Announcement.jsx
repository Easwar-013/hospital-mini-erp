import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import "./Announcement.css";

import AnnouncementTable from "../../components/announcements/AnnouncementTable";
import AddAnnouncementModal from "../../components/announcements/AddAnnouncementModal";

import { getAnnouncements } from "../../services/announcementService";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Load Announcements
  const fetchAnnouncements = async () => {
    try {
      const data = await getAnnouncements();

      setAnnouncements(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load announcements");
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="announcement-page">
      <div className="page-header">
        <div>
          <h1>Announcements</h1>
          <p>Manage hospital announcements.</p>
        </div>

        <button
          className="add-btn"
          onClick={() => {
            setSelectedAnnouncement(null);
            setOpenModal(true);
          }}
        >
          <FaPlus />
          Add Announcement
        </button>
      </div>

      <AnnouncementTable
        announcements={announcements}
        onEdit={(announcement) => {
          setSelectedAnnouncement(announcement);
          setOpenModal(true);
        }}
        onDelete={fetchAnnouncements}
      />

      <AddAnnouncementModal
        isOpen={openModal}
        selectedAnnouncement={selectedAnnouncement}
        onClose={() => {
          setOpenModal(false);
          setSelectedAnnouncement(null);
        }}
        onAnnouncementSaved={fetchAnnouncements}
      />
    </div>
  );
};

export default Announcement;
