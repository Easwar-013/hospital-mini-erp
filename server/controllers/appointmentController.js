import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import PatientUser from "../models/PatientUser.js";

// Create Appointment (Admin/General)
export const createAppointment = async (req, res) => {
  try {
    const lastAppointment = await Appointment.findOne().sort({ appointmentId: -1 });
    let appointmentId = "A001";
    if (lastAppointment) {
      const lastNumber = parseInt(lastAppointment.appointmentId.substring(1));
      appointmentId = `A${String(lastNumber + 1).padStart(3, "0")}`;
    }

    const appointment = await Appointment.create({ appointmentId, ...req.body });

    const io = req.app.get("io");
    if (io) io.emit("appointmentUpdated");

    res.status(201).json({ success: true, message: "Appointment Booked Successfully", appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "fullName specialization")
      .populate("patient", "fullName")
      .sort({ appointmentDate: -1 });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Patient Book Appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctor, department, appointmentDate, appointmentTime, reason } = req.body;

    // 1. Find the logged-in user in the PatientUser collection
    const patientUser = await PatientUser.findById(req.user.id);
    if (!patientUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Generate Appointment ID
    const lastAppointment = await Appointment.findOne().sort({ appointmentId: -1 });
    let appointmentId = "A001";
    if (lastAppointment) {
      const lastNumber = parseInt(lastAppointment.appointmentId.substring(1));
      appointmentId = `A${String(lastNumber + 1).padStart(3, "0")}`;
    }

    // 3. Create appointment using the linked IDs
    const appointment = await Appointment.create({
      appointmentId,
      user: patientUser._id,
      patient: patientUser.patient, // Linked ID from PatientUser
      doctor,
      department,
      appointmentDate,
      appointmentTime,
      reason,
      status: "Scheduled",
    });

    const io = req.app.get("io");
    if (io) io.emit("appointmentUpdated");

    res.status(201).json({ success: true, message: "Appointment Booked Successfully", appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// My Appointments (User Portal)
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate("doctor", "fullName specialization")
      .sort({ appointmentDate: -1 });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Doctor Appointments (By ID param)
export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId || doctorId === 'undefined') {
      return res.status(400).json({ success: false, message: "Invalid Doctor ID" });
    }
    const appointments = await Appointment.find({ doctor: doctorProfile._id })
      .populate("patient", "fullName email phone") 
      .sort({ appointmentDate: 1 });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Doctor Dashboard (Using logged-in User ID)
// Replace your existing getDoctorDashboardAppointments in appointmentController.js
export const getDoctorDashboardAppointments = async (req, res) => {
  try {
    const doctorProfile = await Doctor.findOne({ userId: req.user.id });
    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    // Simplified population: just populate the patient name for now
    const appointments = await Appointment.find({ doctor: doctorProfile._id })
      .populate({
        path: "patient",
        model: "Patient",
        populate: {
          path: "user", // Matches the 'user' field in your Patient schema
          model: "PatientUser", // Matches the collection name in your screenshot
          select: "email" // Only bring the email field
        }
      })
      .sort({ appointmentDate: 1 });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Dashboard Error:", error); // Check this in your backend terminal
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Appointment
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    const io = req.app.get("io");
    if (io) io.emit("appointmentUpdated");

    res.status(200).json({ success: true, message: "Appointment Updated Successfully", appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    const io = req.app.get("io");
    if (io) io.emit("appointmentUpdated");

    res.status(200).json({ success: true, message: "Appointment Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};