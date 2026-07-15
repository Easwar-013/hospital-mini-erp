import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Ward from "../models/Ward.js";
import User from "../models/User.js";

export const getDashboard = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    console.log("Total Patients Found:", totalPatients);

    const totalDoctors = await Doctor.countDocuments();

    const totalReceptionists = await User.countDocuments({ role: "receptionist" });

    const totalAppointments = await Appointment.countDocuments();

   const TOTAL_BEDS = 30;

    // 2. Count how many beds are currently occupied (by counting the assignment records)
    const occupiedBeds = await Ward.countDocuments({ status: "Occupied" });
    console.log("Occupied Beds Count from DB:", occupiedBeds);

    // 3. Calculate available
    const availableBeds = TOTAL_BEDS - occupiedBeds;

    const recentPatients = await Patient.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

    const todayAppointments = await Appointment.find({
      appointmentDate: {
        $gte: today,
        $lt: tomorrow
      }
    })
    .populate("doctor")
    .populate("patient")
    .sort({ appointmentTime: 1 }) // Sort by time instead of just date
    .limit(5);


    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      availableBeds,
      recentPatients,
      todayAppointments,
      totalReceptionists,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};