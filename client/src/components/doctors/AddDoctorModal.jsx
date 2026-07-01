import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { addDoctor, updateDoctor } from "../../services/doctorService";

import "./AddDoctorModal.css";

const AddDoctorModal = ({ isOpen, onClose, selectedDoctor, onDoctorSaved }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    specialization: "Cardiology",
    experience: "",
    phone: "",
    email: "",
    qualification: "",
    status: "Available",
  });

  useEffect(() => {
    if (selectedDoctor) {
      setFormData({
        fullName: selectedDoctor.fullName,
        specialization: selectedDoctor.specialization,
        experience: selectedDoctor.experience,
        phone: selectedDoctor.phone,
        email: selectedDoctor.email,
        qualification: selectedDoctor.qualification,
        status: selectedDoctor.status,
      });
    } else {
      setFormData({
        fullName: "",
        specialization: "Cardiology",
        experience: "",
        phone: "",
        email: "",
        qualification: "",
        status: "Available",
      });
    }
  }, [selectedDoctor, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedDoctor) {
        await updateDoctor(selectedDoctor._id, formData);

        toast.success("Doctor Updated Successfully");
      } else {
        await addDoctor(formData);

        toast.success("Doctor Added Successfully");
      }

      onDoctorSaved();

      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation Failed");
    }
  };

  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="patient-modal">
        <div className="modal-header">
          <h2>{selectedDoctor ? "Edit Doctor" : "Add Doctor"}</h2>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="patient-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Doctor ID</label>
            <input value="Auto Generated" disabled />
          </div>

          <div className="form-group">
            <label>Doctor Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter doctor name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department</label>

              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
              >
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Orthopedics</option>
                <option>Dermatology</option>
                <option>Pediatrics</option>
              </select>
            </div>

            <div className="form-group">
              <label>Experience</label>

              <input
                type="number"
                name="experience"
                placeholder="Experience"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="doctor@hospital.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Qualification</label>

              <input
                type="text"
                name="qualification"
                placeholder="MBBS, MD"
                value={formData.qualification}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Availability</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Available</option>
                <option>On Leave</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button className="save-btn" type="submit">
              {selectedDoctor ? "Update Doctor" : "Save Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorModal;
