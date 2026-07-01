import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { addPatient, updatePatient } from "../../services/patientService";

import "./AddPatientModal.css";

const AddPatientModal = ({
  isOpen,
  onClose,
  selectedPatient,
  onPatientSaved,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "Male",
    phone: "",
    doctor: "",
    bloodGroup: "O+",
    status: "Admitted",
    address: "",
  });

  useEffect(() => {
    if (selectedPatient) {
      setFormData({
        fullName: selectedPatient.fullName,
        age: selectedPatient.age,
        gender: selectedPatient.gender,
        phone: selectedPatient.phone,
        doctor: selectedPatient.doctor,
        bloodGroup: selectedPatient.bloodGroup,
        status: selectedPatient.status,
        address: selectedPatient.address,
      });
    } else {
      setFormData({
        fullName: "",
        age: "",
        gender: "Male",
        phone: "",
        doctor: "",
        bloodGroup: "O+",
        status: "Admitted",
        address: "",
      });
    }
  }, [selectedPatient, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !formData.fullName ||
        !formData.age ||
        !formData.phone ||
        !formData.doctor ||
        !formData.address
      ) {
        toast.error("Please fill all required fields");
        return;
      }
      if (selectedPatient) {
        await updatePatient(selectedPatient._id, formData);

        toast.success("Patient Updated Successfully");
      } else {
        await addPatient(formData);

        toast.success("Patient Added Successfully");
      }

      onPatientSaved();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to Add Patient");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="patient-modal">
        <div className="modal-header">
          <h2>{selectedPatient ? "Edit Patient" : "Add New Patient"}</h2>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="patient-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient ID</label>

            <input type="text" value="Auto Generated" disabled />
          </div>
          <div className="form-group">
            <label>Patient Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter patient name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Consulting Doctor</label>

            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
            >
              <option value="">Select Doctor</option>
              <option>Dr. John</option>
              <option>Dr. Sarah</option>
              <option>Dr. David</option>
              <option>Dr. Priya</option>
            </select>
          </div>

          <div className="form-group">
            <label>Blood Group</label>

            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
            >
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div>

          <div className="form-group">
            <label>Admission Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Admitted</option>
              <option>Out Patient</option>
              <option>Discharged</option>
            </select>
          </div>

          <div className="form-group">
            <label>Address</label>

            <textarea
              rows="3"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn">
              {selectedPatient ? "Update Patient" : "Save Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;
