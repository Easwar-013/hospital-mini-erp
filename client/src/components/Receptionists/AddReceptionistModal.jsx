import { useState } from "react";
import { toast } from "react-toastify";
import { addReceptionist } from "../../services/receptionistService";
import "./AddReceptionistModal.css";

const AddReceptionistModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    email: "",
    phone: "",
    password: "",
    ward: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReceptionist(formData);
      toast.success("Receptionist added successfully!");
      onAdd(); // Refresh the list
      onClose(); // Close the modal
    } catch (err) {
      toast.error("Failed to add receptionist");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add Receptionist</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            required
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Age"
            required
            min="18" // Optional: prevents invalid ages
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Phone"
            required
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <select
            required
            value={formData.ward}
            onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
          >
            <option value="" disabled>
              Select Ward
            </option>
            <option value="General Ward">General Ward</option>
            <option value="ICU">ICU</option>
            <option value="Emergency">Emergency</option>
            <option value="Private Ward">Private Ward</option>
            <option value="Deluxe Ward">Deluxe Ward</option>
          </select>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReceptionistModal;
