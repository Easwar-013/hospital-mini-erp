import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Ward from "../models/Ward.js";

export const getDashboard = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();

    const totalDoctors = await Doctor.countDocuments();

    const totalAppointments = await Appointment.countDocuments();

    const availableBeds = await Ward.countDocuments({
      status: "Available",
    });

    const recentPatients = await Patient.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const todayAppointments = await Appointment.find()
      .populate("doctor")
      .populate("patient")
      .sort({ appointmentDate: 1 })
      .limit(5);

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      availableBeds,
      recentPatients,
      todayAppointments,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};