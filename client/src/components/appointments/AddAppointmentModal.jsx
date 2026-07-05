import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  addAppointment,
  updateAppointment,
} from "../../services/appointmentService";

import { getPatients } from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";
import Select from "react-select";
import { addNotification } from "../../services/notificationService";

import "./AddAppointmentModal.css";

const initialFormData = {
  patient: "",
  doctor: "",
  department: "",
  appointmentDate: "",
  appointmentTime: "",
  status: "Scheduled",
};

const AddAppointmentModal = ({
  isOpen,
  onClose,
  selectedAppointment,
  onAppointmentSaved,
}) => {
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
      } catch (error) {
        toast.error("Failed to load Patients/Doctors");
      }
    };

    loadData();
  }, [isOpen]);

  useEffect(() => {
    if (selectedAppointment) {
      setFormData({
        patient: selectedAppointment.patient?._id || "",
        doctor: selectedAppointment.doctor?._id || "",
        appointmentDate: selectedAppointment.appointmentDate || "",
        appointmentTime: selectedAppointment.appointmentTime || "",
        status: selectedAppointment.status || "Scheduled",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedAppointment, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const patientOptions = (patients || []).map((patient) => ({
    value: patient._id,
    label: `${patient.fullName} (${patient.phone})`,
  }));

  const doctorOptions = (doctors || []).map((doctor) => ({
    value: doctor._id,
    label: `${doctor.fullName} - ${doctor.specialization}`,
    department: doctor.department || doctor.specialization,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.patient ||
      !formData.doctor ||
      !formData.appointmentDate ||
      !formData.appointmentTime
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // Grab the logged-in user from localStorage
      const currentUser = JSON.parse(localStorage.getItem("user"));

      // Create a complete payload with the required user ID attached
      const payloadToSubmit = {
        ...formData,
        user: currentUser?._id || currentUser?.id,
      };

      if (selectedAppointment) {
        console.log("Submitting formData:", payloadToSubmit);
        // Pass the new payload here
        await updateAppointment(selectedAppointment._id, payloadToSubmit);

        addNotification({
          icon: "📅",
          title: "Appointment Updated",
          message: "Appointment details have been updated.",
        });

        toast.success("Appointment Updated Successfully");
      } else {
        // Pass the new payload here
        await addAppointment(payloadToSubmit);

        addNotification({
          icon: "📅",
          title: "Appointment Booked",
          message: "A new appointment has been scheduled.",
        });

        toast.success("Appointment Booked Successfully");
      }

      setFormData(initialFormData);
      onAppointmentSaved();
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
          <h2>
            {selectedAppointment ? "Edit Appointment" : "Book Appointment"}
          </h2>

          <button type="button" className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="patient-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Appointment ID</label>

            <input value="Auto Generated" disabled />
          </div>

          <div className="form-group">
            <label>Patient</label>

            <Select
              options={patientOptions}
              placeholder="Search Patient..."
              value={
                patientOptions.find(
                  (option) => option.value === formData.patient,
                ) || null
              }
              onChange={(selected) =>
                setFormData({
                  ...formData,
                  patient: selected ? selected.value : "",
                })
              }
              isSearchable
            />
          </div>

          <div className="form-group">
            <label>Doctor</label>

            <Select
              options={doctorOptions}
              placeholder="Search Doctor..."
              value={
                doctorOptions.find(
                  (option) => option.value === formData.doctor,
                ) || null
              }
              onChange={(selected) =>
                setFormData({
                  ...formData,
                  doctor: selected ? selected.value : "",
                  department: selected ? selected.department : "",
                })
              }
              isSearchable
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>

              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Time</label>

              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={(e) => {
                console.log("Status changed:", e.target.value);

                setFormData({
                  ...formData,
                  status: e.target.value,
                });
              }}
            >
              <option value="Pending Approval">Pending Approval</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button className="save-btn" type="submit">
              {selectedAppointment ? "Update Appointment" : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
