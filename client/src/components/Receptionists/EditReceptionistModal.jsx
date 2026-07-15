import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/axios"; // Ensure this matches your axios instance

const EditReceptionistModal = ({ receptionist, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: receptionist.name || "",
    email: receptionist.email || "",
    phone: receptionist.phone || "",
    department: receptionist.department || "",
    status: receptionist.status || "Active",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/receptionists/${receptionist._id}`, formData);
      toast.success("Receptionist updated successfully");
      onUpdate();
    } catch (err) {
      toast.error("Failed to update receptionist");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Receptionist</h3>
        <form onSubmit={handleSubmit}>
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
            required
          />
          <input
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Email"
            required
          />
          <input
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="Phone"
          />
          <input
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            placeholder="Ward/Department"
          />
          {/* Status Dropdown */}
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div className="modal-actions">
            <button type="submit" className="update-btn">
              Update
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReceptionistModal;
