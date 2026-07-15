import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import PatientUser from "../models/PatientUser.js";

// Create Patient
export const createPatient = async (req, res) => {
  try {
    const lastPatient = await Patient.findOne().sort({ patientId: -1 });
    let patientId = "P001";
    if (lastPatient) {
      const lastNumber = parseInt(lastPatient.patientId.substring(1));
      patientId = `P${String(lastNumber + 1).padStart(3, "0")}`;
    }
    const patient = await Patient.create({ patientId, ...req.body });
    res.status(201).json({ success: true, message: "Patient Added Successfully", patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Patients
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 }).lean();
    const doctors = await Doctor.find().lean();
    const updatedPatients = patients.map((patient) => {
      if (patient.doctor && patient.doctor.toString().length === 24) {
        const matchedDoctor = doctors.find((doc) => doc._id.toString() === patient.doctor.toString());
        if (matchedDoctor) {
          patient.doctor = { _id: matchedDoctor._id, fullName: matchedDoctor.fullName };
        }
      }
      return patient;
    });
    res.status(200).json({ success: true, patients: updatedPatients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Patient
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.status(200).json({ success: true, message: "Patient Updated Successfully", patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Patient (Updated to remove associated user account)
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

    // Also remove the associated PatientUser account using the phone number
    await PatientUser.findOneAndDelete({ phone: patient.phone });

    res.status(200).json({ success: true, message: "Patient and User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};