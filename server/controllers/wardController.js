import Ward from "../models/Ward.js";

// ===============================
// Create Ward Assignment
// ===============================
export const createWard = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      wardName,
      bedNumber,
      admissionDate,
      status,
    } = req.body;

    // Check if bed is already occupied
    const bedExists = await Ward.findOne({
      wardName,
      bedNumber,
      status: "Occupied",
    });

    if (bedExists) {
      return res.status(400).json({
        success: false,
        message: "This bed is already occupied.",
      });
    }

    const ward = await Ward.create({
      patient,
      doctor,
      wardName,
      bedNumber,
      admissionDate,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Patient assigned successfully.",
      ward,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Ward Assignments
// ===============================
export const getWards = async (req, res) => {
  try {
    const wards = await Ward.find()
      .populate("patient", "patientId fullName")
      .populate("doctor", "doctorId fullName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      wards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Ward Assignment
// ===============================
export const updateWard = async (req, res) => {
  try {
    const {
      wardName,
      bedNumber,
      status,
    } = req.body;

    // Check if another occupied record already uses this bed
    const bedExists = await Ward.findOne({
      _id: { $ne: req.params.id },
      wardName,
      bedNumber,
      status: "Occupied",
    });

    if (bedExists) {
      return res.status(400).json({
        success: false,
        message: "This bed is already occupied.",
      });
    }

    const ward = await Ward.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward assignment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ward updated successfully.",
      ward,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Ward Assignment
// ===============================
export const deleteWard = async (req, res) => {
  try {
    const ward = await Ward.findByIdAndDelete(req.params.id);

    if (!ward) {
      return res.status(404).json({
        success: false,
        message: "Ward assignment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ward assignment deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};