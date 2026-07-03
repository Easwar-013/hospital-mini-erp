import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

import { addWard, updateWard } from "../../services/wardService";

import { getPatients } from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";

import "./AddWardModal.css";

const initialFormData = {
  patient: "",
  doctor: "",
  wardName: "General Ward",
  bedNumber: "Bed 1",
  admissionDate: "",
  status: "Occupied",
};

const AddWardModal = ({ isOpen, onClose, selectedWard, onWardSaved }) => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      try {
        const patientRes = await getPatients();
        const doctorRes = await getDoctors();

        setPatients(patientRes || []);
        setDoctors(doctorRes || []);
      } catch {
        toast.error("Failed to load data");
      }
    };

    loadData();
  }, [isOpen]);

  useEffect(() => {
    if (selectedWard) {
      setFormData({
        patient: selectedWard.patient?._id || "",
        doctor: selectedWard.doctor?._id || "",
        wardName: selectedWard.wardName,
        bedNumber: selectedWard.bedNumber,
        admissionDate: selectedWard.admissionDate,
        status: selectedWard.status,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedWard, isOpen]);

  const patientOptions = (patients || []).map((patient) => ({
    value: patient._id,
    label: `${patient.patientId} - ${patient.fullName}`,
  }));

  const doctorOptions = (doctors || []).map((doctor) => ({
    value: doctor._id,
    label: `${doctor.fullName} | ${doctor.specialization}`,
  }));

  const wards = [
    "General Ward",
    "ICU",
    "Emergency",
    "Private Ward",
    "Deluxe Ward",
  ];

  const beds = Array.from({ length: 20 }, (_, i) => `Bed ${i + 1}`);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patient || !formData.doctor || !formData.admissionDate) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (selectedWard) {
        await updateWard(selectedWard._id, formData);

        addNotification({
          icon: "🛏️",
          title: "Ward Updated",
          message: "Ward assignment has been updated.",
        });

        toast.success("Ward Updated Successfully");
      } else {
        await addWard(formData);

        addNotification({
          icon: "🛏️",
          title: "Ward Assigned",
          message: "A patient has been assigned to a ward.",
        });

        toast.success("Ward Assigned Successfully");
      }

      onWardSaved();

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
          <h2>{selectedWard ? "Edit Ward" : "Assign Ward"}</h2>

          <button type="button" className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="patient-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient</label>

            <Select
              options={patientOptions}
              placeholder="Search Patient..."
              value={
                patientOptions.find((x) => x.value === formData.patient) || null
              }
              onChange={(selected) =>
                setFormData({
                  ...formData,
                  patient: selected.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Doctor</label>

            <Select
              options={doctorOptions}
              placeholder="Search Doctor..."
              value={
                doctorOptions.find((x) => x.value === formData.doctor) || null
              }
              onChange={(selected) =>
                setFormData({
                  ...formData,
                  doctor: selected.value,
                })
              }
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ward</label>

              <select
                name="wardName"
                value={formData.wardName}
                onChange={handleChange}
              >
                {wards.map((ward) => (
                  <option key={ward}>{ward}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Bed</label>

              <select
                name="bedNumber"
                value={formData.bedNumber}
                onChange={handleChange}
              >
                {beds.map((bed) => (
                  <option key={bed}>{bed}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Admission Date</label>

              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Occupied</option>
                <option>Available</option>
                <option>Maintenance</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button className="save-btn" type="submit">
              {selectedWard ? "Update Ward" : "Assign Ward"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWardModal;
