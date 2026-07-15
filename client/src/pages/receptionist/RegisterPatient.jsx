import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  addPatient,
  getPatients,
  updatePatient,
} from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";
import { FaEdit } from "react-icons/fa"; // Import the edit icon
import "./RegisterPatient.css";

const RegisterPatient = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Track if we are editing an existing patient
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    fullName: "",
    age: "",
    gender: "Male",
    phone: "",
    doctor: "",
    bloodGroup: "O+",
    status: "Admitted",
    address: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchAllData = async () => {
    try {
      const patientData = await getPatients();
      const doctorData = await getDoctors();
      setPatients(patientData || []);
      setDoctors(doctorData || []);
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Populate form with selected patient's data
  const handleEdit = (patient) => {
    setEditingId(patient._id);
    setFormData({
      fullName: patient.fullName || "",
      age: patient.age || "",
      gender: patient.gender || "Male",
      phone: patient.phone || "",
      doctor: patient.doctor?._id || patient.doctor || "",
      bloodGroup: patient.bloodGroup || "O+",
      status: patient.status || "Admitted",
      address: patient.address || "",
    });
    // Scroll smoothly to the top form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel edit mode and clear form
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing patient
        await updatePatient(editingId, formData);
        toast.success("Patient Updated Successfully");
      } else {
        // Add new patient
        await addPatient(formData);
        toast.success("Patient Registered Successfully");
      }

      setFormData(initialFormState);
      setEditingId(null);
      fetchAllData(); // Refresh table
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation Failed");
    }
  };

  return (
    <div className="receptionist-content">
      <div className="receptionist-page-header">
        <h1>{editingId ? "Edit Patient" : "Register New Patient"}</h1>
      </div>

      <form className="receptionist-patient-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            name="age"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
          />

          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <select name="doctor" value={formData.doctor} onChange={handleChange}>
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.fullName}
              </option>
            ))}
          </select>

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Admitted">Admitted</option>
            <option value="Out Patient">Out Patient</option>
            <option value="Discharged">Discharged</option>
          </select>

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-action-buttons">
          <button type="submit" className="receptionist-save-btn">
            {editingId ? "Update Patient" : "Register Patient"}
          </button>

          {editingId && (
            <button
              type="button"
              className="receptionist-cancel-btn"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="receptionist-page-header" style={{ marginTop: "30px" }}>
        <h1>Patient Records</h1>
      </div>
      <table className="receptionist-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p._id}>
              <td>{p.patientId}</td>
              <td>{p.fullName}</td>
              <td>{p.phone}</td>
              <td>
                <span
                  className={`status ${p.status === "Admitted" ? "admitted" : "discharged"}`}
                >
                  {p.status}
                </span>
              </td>
              <td>
                <button
                  className="table-edit-btn"
                  onClick={() => handleEdit(p)}
                  title="Edit Patient"
                >
                  <FaEdit size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegisterPatient;
