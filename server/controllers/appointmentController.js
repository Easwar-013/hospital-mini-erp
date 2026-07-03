import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Patient from "../models/Patient.js";

// Create Appointment
export const createAppointment = async (req, res) => {
  try {
    const lastAppointment = await Appointment.findOne().sort({
      appointmentId: -1,
    });

    let appointmentId = "A001";

    if (lastAppointment) {
      const lastNumber = parseInt(lastAppointment.appointmentId.substring(1));
      appointmentId = `A${String(lastNumber + 1).padStart(3, "0")}`;
    }

    const appointment = await Appointment.create({
      appointmentId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Appointment Booked Successfully",
      appointment,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Patient Book Appointment
export const bookAppointment = async (req, res) => {
  try {
    const {
      doctor,
      department,
      appointmentDate,
      appointmentTime,
      reason,
    } = req.body;

    const lastAppointment = await Appointment.findOne().sort({
      appointmentId: -1,
    });

    let appointmentId = "A001";

    if (lastAppointment) {
      const lastNumber = parseInt(
        lastAppointment.appointmentId.substring(1)
      );

      appointmentId = `A${String(lastNumber + 1).padStart(3, "0")}`;
    }

    // Logged in User
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find Patient using phone number
    const patient = await Patient.findOne({
      phone: user.username,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient record not found",
      });
    }

    const appointment = await Appointment.create({
      appointmentId,
      user: user._id,
      patient: patient._id,
      doctor,
      department,
      appointmentDate,
      appointmentTime,
      reason,
      status: "Scheduled",
    });

    res.status(201).json({
      success: true,
      message: "Appointment Booked Successfully",
      appointment,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// My Appointments
export const getMyAppointments = async (req, res) => {

  try {

    const appointments = await Appointment.find({
      user: req.user.id,
    })
      .populate("doctor", "fullName specialization")
      .sort({
        appointmentDate: -1,
      });

    res.status(200).json({
      success: true,
      appointments,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// Get Appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "patientId fullName")
      .populate("doctor", "doctorId fullName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Appointment
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment Updated Successfully",
      appointment,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};