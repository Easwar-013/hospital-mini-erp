import Patient from "../models/Patient.js";

// Create Patient
export const createPatient = async (req, res) => {
  try {
    // Generate Patient ID
   // Get latest patient
    const lastPatient = await Patient.findOne().sort({ patientId: -1 });

    let patientId = "P001";

    if (lastPatient) {
        const lastNumber = parseInt(lastPatient.patientId.substring(1));

        patientId = `P${String(lastNumber + 1).padStart(3, "0")}`;
    }

    const patient = await Patient.create({
      patientId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Patient Added Successfully",
      patient,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Patients
// Get Patients
export const getPatients = async (req, res) => {
  try {
    // FIX: Added .populate("doctor", "fullName") to grab the doctor's name!
    const patients = await Patient.find()
      .populate("doctor", "fullName") 
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      patients,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Patient
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient Updated Successfully",
      patient,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Patient
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};