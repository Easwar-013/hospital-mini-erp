import Doctor from "../models/Doctor.js";

// Add Doctor
export const createDoctor = async (req, res) => {
  try {
    // Get latest doctor
    const lastDoctor = await Doctor.findOne().sort({ doctorId: -1 });

    let doctorId = "D001";

    if (lastDoctor) {
      const lastNumber = parseInt(lastDoctor.doctorId.substring(1));

      doctorId = `D${String(lastNumber + 1).padStart(3, "0")}`;
    }

    const doctor = await Doctor.create({
      doctorId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Doctor Added Successfully",
      doctor,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Get Doctors
export const getDoctors = async (req, res) => {
  try {

    const doctors = await Doctor.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      doctors,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Update Doctor
export const updateDoctor = async (req, res) => {
  try {

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor Updated Successfully",
      doctor,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Delete Doctor
export const deleteDoctor = async (req, res) => {
  try {

    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};