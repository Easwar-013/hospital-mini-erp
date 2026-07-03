import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  addAnnouncement,
  updateAnnouncement,
} from "../../services/announcementService";

import { addNotification } from "../../services/notificationService";
import "./AddAnnouncementModal.css";

const initialFormData = {
  title: "",
  message: "",
  icon: "📢",
  active: true,
};

const AddAnnouncementModal = ({
  isOpen,
  onClose,
  selectedAnnouncement,
  onAnnouncementSaved,
}) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (selectedAnnouncement) {
      setFormData({
        title: selectedAnnouncement.title,
        message: selectedAnnouncement.message,
        icon: selectedAnnouncement.icon,
        active: selectedAnnouncement.active,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedAnnouncement, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.message) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (selectedAnnouncement) {
        await updateAnnouncement(selectedAnnouncement._id, formData);

        toast.success("Announcement Updated Successfully");
      } else {
        await addAnnouncement(formData);

        addNotification({
          icon: formData.icon,
          title: "Announcement Added",
          message: formData.title,
        });

        toast.success("Announcement Added Successfully");
      }

      onAnnouncementSaved();
      onClose();
      setFormData(initialFormData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation Failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="patient-modal">
        <div className="modal-header">
          <h2>
            {selectedAnnouncement ? "Edit Announcement" : "Add Announcement"}
          </h2>

          <button type="button" className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="patient-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Announcement title"
            />
          </div>

          <div className="form-group">
            <label>Message</label>

            <textarea
              rows="4"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Announcement message"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Icon</label>

              <select name="icon" value={formData.icon} onChange={handleChange}>
                <option value="📢">📢 Announcement</option>
                <option value="⚠️">⚠️ Warning</option>
                <option value="🏥">🏥 Hospital</option>
                <option value="💊">💊 Medicine</option>
                <option value="🩸">🩸 Blood Camp</option>
                <option value="👨‍⚕️">👨‍⚕️ Staff</option>
                <option value="📅">📅 Event</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                name="active"
                value={formData.active}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    active: e.target.value === "true",
                  })
                }
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn">
              {selectedAnnouncement
                ? "Update Announcement"
                : "Save Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAnnouncementModal;
