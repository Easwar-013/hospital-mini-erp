import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

import {
  addBill,
  updateBill,
} from "../../services/billingService";

import { getPatients } from "../../services/patientService";
import { getWards } from "../../services/wardService";
import { getAppointments } from "../../services/appointmentService";
import "./GenerateBillModal.css";

const initialFormData = {
  patient: "",
  doctor: "",
  ward: "",

  consultationFee: 500,
  wardCharge: 0,
  medicineCharge: 0,
  labCharge: 0,
  otherCharge: 0,
  discount: 0,

  paymentMethod: "Cash",
  paymentStatus: "Pending",
};

const GenerateBillModal = ({ isOpen, onClose, selectedBill, onBillSaved }) => {
  const [patients, setPatients] = useState([]);
  const [wards, setWards] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      try {
        const patientRes = await getPatients();
        const wardRes = await getWards();
        const appointmentRes = await getAppointments();

        setPatients(patientRes || []);
        setWards(wardRes || []);
        setAppointments(appointmentRes || []);
      } catch {
        toast.error("Failed to load data");
      }
    };

    loadData();
  }, [isOpen]);

  useEffect(() => {
    if (selectedBill) {
      setFormData({
        patient: selectedBill.patient?._id || "",
        doctor: selectedBill.doctor?._id || "",
        ward: selectedBill.ward?._id || "",

        consultationFee: selectedBill.consultationFee,

        wardCharge: selectedBill.wardCharge,

        medicineCharge: selectedBill.medicineCharge,

        labCharge: selectedBill.labCharge,

        otherCharge: selectedBill.otherCharge,

        discount: selectedBill.discount,

        paymentMethod: selectedBill.paymentMethod,

        paymentStatus: selectedBill.paymentStatus,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedBill, isOpen]);

  useEffect(() => {
    if (!formData.patient) return;

    // Latest appointment for selected patient
    const patientAppointments = (appointments || [])
      .filter((a) => a.patient?._id === formData.patient)
      .sort(
        (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate),
      );

    const latestAppointment = patientAppointments[0];

    // Ward (optional)
    const ward = (wards || []).find((w) => w.patient?._id === formData.patient);

    let wardCharge = 0;
    let wardId = "";

    if (ward) {
      wardId = ward._id;

      switch (ward.wardName) {
        case "ICU":
          wardCharge = 5000;
          break;

        case "Private Ward":
          wardCharge = 3500;
          break;

        case "Deluxe Ward":
          wardCharge = 4500;
          break;

        default:
          wardCharge = 2000;
      }
    }

    setFormData((prev) => ({
      ...prev,
      doctor: latestAppointment?.doctor?._id || "",
      ward: wardId,
      wardCharge,
    }));
  }, [formData.patient, appointments, wards]);

  const totalAmount = useMemo(() => {
    return (
      Number(formData.consultationFee) +
      Number(formData.wardCharge) +
      Number(formData.medicineCharge) +
      Number(formData.labCharge) +
      Number(formData.otherCharge) -
      Number(formData.discount)
    );
  }, [formData]);

  const patientOptions = (patients || []).map((patient) => ({
    value: patient._id,
    label: `${patient.patientId} - ${patient.fullName}`,
  }));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patient) {
      toast.error("Please select a patient");
      return;
    }



    try {
      const payload = {
        ...formData,
        totalAmount,
      };

      if (!payload.ward) {
        delete payload.ward;
      }

      if (!payload.doctor) {
        delete payload.doctor;
      }

      if (selectedBill) {
        await updateBill(selectedBill._id, payload);

        addNotification({
          icon: "💰",
          title: "Bill Updated",
          message: `Invoice ${selectedBill.invoiceNumber} has been updated.`,
        });

        toast.success("Bill Updated Successfully");
      } else {
        await addBill(payload);


        toast.success("Bill Generated Successfully");
      }

      onBillSaved();

      onClose();

      setFormData(initialFormData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to Generate Bill");
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="patient-modal">
        <div className="modal-header">
          <h2>{selectedBill ? "Edit Bill" : "Generate Bill"}</h2>

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
                patientOptions.find(
                  (item) => item.value === formData.patient,
                ) || null
              }
              onChange={(selected) =>
                setFormData({
                  ...formData,
                  patient: selected.value,
                })
              }
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Doctor</label>

              <input
                value={
                  (appointments || []).find(
                    (a) => a.doctor?._id === formData.doctor,
                  )?.doctor?.fullName || ""
                }
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Ward</label>

              <input
                value={
                  (wards || []).find((w) => w._id === formData.ward)
                    ?.wardName || ""
                }
                readOnly
              />
            </div>
          </div>

          <hr />

          <div className="form-row">
            <div className="form-group">
              <label>Consultation Fee</label>

              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Ward Charge</label>

              <input
                type="number"
                name="wardCharge"
                value={formData.wardCharge}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Medicine Charge</label>

              <input
                type="number"
                name="medicineCharge"
                value={formData.medicineCharge}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Lab Charge</label>

              <input
                type="number"
                name="labCharge"
                value={formData.labCharge}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Other Charge</label>

              <input
                type="number"
                name="otherCharge"
                value={formData.otherCharge}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Discount</label>

              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Payment Method</label>

              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
                <option>Net Banking</option>
              </select>
            </div>

            <div className="form-group">
              <label>Payment Status</label>

              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Paid</option>
                <option>Partially Paid</option>
              </select>
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
              background: "#EFF6FF",
              padding: 18,
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <h2
              style={{
                color: "#2563EB",
                margin: 0,
              }}
            >
              Grand Total
            </h2>

            <h1
              style={{
                marginTop: 10,
                color: "#059669",
              }}
            >
              ₹ {totalAmount}
            </h1>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn">
              {selectedBill ? "Update Bill" : "Generate Bill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateBillModal;