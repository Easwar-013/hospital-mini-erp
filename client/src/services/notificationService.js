import { getPatients } from "./patientService";
import { getAppointments } from "./appointmentService";
import { getBills } from "./billingService";
import { getWards } from "./wardService";

const STORAGE_KEY = "hospital_notifications";

// ===============================
// Load Notifications
// ===============================
export const getNotifications = async () => {
  const [patients, appointments, billData, wards] = await Promise.all([
    getPatients(),
    getAppointments(),
    getBills(),
    getWards(),
  ]);

  const bills = billData.bills || [];

  // Notifications stored from CRUD operations
  const savedNotifications =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const notifications = [...savedNotifications];

  const today = new Date().toDateString();

  // Today's Appointments
  appointments.forEach((appointment) => {
    if (
      appointment.appointmentDate &&
      new Date(appointment.appointmentDate).toDateString() === today
    ) {
      notifications.push({
        id: `appt-${appointment._id}`,
        icon: "📅",
        title: "Today's Appointment",
        message: `${appointment.patient?.fullName || "Patient"} has an appointment today.`,
        time: "Today",
      });
    }
  });

  // Pending Bills
  const pendingBills = bills.filter(
    (bill) => bill.paymentStatus === "Pending"
  );

  if (pendingBills.length > 0) {
    notifications.push({
      id: "pending-bills",
      icon: "💰",
      title: "Pending Bills",
      message: `${pendingBills.length} bill(s) are pending payment.`,
      time: "Now",
    });
  }

  // Available Beds
  const TOTAL_BEDS = 30;
  const availableBeds = TOTAL_BEDS - wards.length;

  if (availableBeds <= 5) {
    notifications.push({
      id: "beds-warning",
      icon: "⚠️",
      title: "Low Bed Availability",
      message: `Only ${availableBeds} bed(s) remaining.`,
      time: "Now",
    });
  }

  // New Patients Added Today
  patients.forEach((patient) => {
    if (
      patient.createdAt &&
      new Date(patient.createdAt).toDateString() === today
    ) {
      notifications.push({
        id: `patient-${patient._id}`,
        icon: "👤",
        title: "New Patient",
        message: `${patient.fullName} has been registered today.`,
        time: "Today",
      });
    }
  });

  return notifications;
};

// ===============================
// Add Notification (CRUD)
// ===============================
export const addNotification = (notification) => {
  const notifications =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  notifications.unshift({
    id: Date.now(),
    time: new Date().toLocaleString(),
    ...notification,
  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(notifications)
  );
};

// ===============================
// Clear All Notifications
// ===============================
export const clearNotifications = () => {
  localStorage.removeItem(STORAGE_KEY);
};