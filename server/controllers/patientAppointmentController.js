import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";

// ==========================
// Book Appointment Request
// ==========================
export const bookAppointment = async (req, res) => {
  try {
    const {
      department,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
    } = req.body;

    console.log("Logged in user:", req.user);

    const patient = await Patient.findById(req.user.patient);

    console.log("Patient:", patient);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient record not found",
      });
    }

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
      user: req.user._id,
      patient: patient._id,
      department,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
      status: "Pending Approval",
    });

    res.status(201).json({
      success: true,
      message: "Appointment request submitted successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get My Appointments
// ==========================
export const getMyAppointments = async (req, res) => {
  try {
    console.log("Logged User:", req.user);

    // FIX: Search by the patient's medical record ID, not the login user ID!
    const appointments = await Appointment.find({
      patient: req.user.patient, 
    })
      .populate("doctor", "fullName specialization")
      .sort({ createdAt: -1 });

    console.log("Appointments:", appointments);

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};