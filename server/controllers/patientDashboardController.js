import Appointment from "../models/Appointment.js";
import Bill from "../models/Bill.js";
import Announcement from "../models/Announcement.js";
import Patient from "../models/Patient.js";

export const getPatientDashboard = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      phone: req.user.phone,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const appointments = await Appointment.find({
      patient: patient._id,
    })
      .populate("doctor")
      .sort({ appointmentDate: 1 });

    const bills = await Bill.find({
      patient: patient._id,
    });

    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const now = new Date();

    // -------------------------------
    // Find Upcoming Appointment
    // -------------------------------

    let upcomingAppointment = null;

    for (const appointment of appointments) {
      const appointmentDate = new Date(appointment.appointmentDate);

      // add hours & minutes
      const [hour, minute] = appointment.appointmentTime
        .split(":")
        .map(Number);

      appointmentDate.setHours(hour);
      appointmentDate.setMinutes(minute);
      appointmentDate.setSeconds(0);

      if (
        appointmentDate >= now &&
        appointment.status === "Scheduled"
      ) {
        upcomingAppointment = appointment;
        break;
      }
    }

    // -------------------------------
    // Pending Bill Amount
    // -------------------------------

    const pendingBillAmount = bills
      .filter((bill) => bill.paymentStatus === "Pending")
      .reduce((sum, bill) => sum + bill.totalAmount, 0);

    // -------------------------------
    // Notifications
    // -------------------------------

    const notifications = [];

    appointments.forEach((appointment) => {
      if (appointment.status === "Scheduled") {
        notifications.push({
          icon: "📅",
          message: "Appointment booked successfully",
        });
      }

      if (appointment.status === "Completed") {
        notifications.push({
          icon: "✅",
          message: "Appointment completed",
        });
      }

      if (appointment.status === "Cancelled") {
        notifications.push({
          icon: "❌",
          message: "Appointment cancelled",
        });
      }
    });

    bills.forEach((bill) => {
      notifications.push({
        icon: "💳",
        message: `Bill ${bill.invoiceNumber} generated`,
      });
    });

    announcements.forEach((announcement) => {
      notifications.push({
        icon: "📢",
        message: announcement.title,
      });
    });

    res.json({
      success: true,
      patientName: patient.fullName,
      appointmentCount: appointments.length,
      pendingBillAmount,
      upcomingAppointment,
      announcements,
      notifications,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};