import express from "express";
import { getMyBills } from "../controllers/billingController.js";

import {
  registerPatient,
  loginPatient,
  googleLogin, // IMPORT NEW FUNCTION
  phoneLogin,  // IMPORT NEW FUNCTION
  getProfile,
} from "../controllers/patientUserController.js";

import {
  bookAppointment,
  getMyAppointments,
} from "../controllers/patientAppointmentController.js";

import patientAuth from "../middleware/patientAuth.js";
import { getPatientDashboard } from "../controllers/patientDashboardController.js";
import { generateInvoicePDF } from "../controllers/pdfController.js";
const router = express.Router();

// ==========================================
// Authentication Routes
// ==========================================
router.post("/register", registerPatient);
router.post("/login", loginPatient);

// NEW FIREBASE ROUTES
router.post("/google-login", googleLogin);
router.post("/phone-login", phoneLogin);

// ==========================================
// Protected Routes (Require Token)
// ==========================================
// Profile & Dashboard
router.get("/profile", patientAuth, getProfile);
router.get("/dashboard", patientAuth, getPatientDashboard);

// Billing
router.get("/my-bills", patientAuth, getMyBills);
router.get("/bill/:id/pdf", patientAuth, generateInvoicePDF);

// Appointments
router.post("/book-appointment", patientAuth, bookAppointment);
router.get("/my-appointments", patientAuth, getMyAppointments);


console.log("Patient User Routes Loaded");
export default router;