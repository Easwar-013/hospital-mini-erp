import express from "express";
import { getMyBills } from "../controllers/billingController.js";

import {
  registerPatient,
  loginPatient,
  getProfile,
} from "../controllers/patientUserController.js";

import {
  bookAppointment,
  getMyAppointments,
} from "../controllers/patientAppointmentController.js";

import patientAuth from "../middleware/patientAuth.js";
import { getPatientDashboard } from "../controllers/patientDashboardController.js";

const router = express.Router();

// Authentication
router.post("/register", registerPatient);
router.post("/login", loginPatient);

// Profile
router.get("/profile", patientAuth, getProfile);

router.get("/my-bills", patientAuth, getMyBills);

router.get(
  "/dashboard",
  patientAuth,
  getPatientDashboard
);

// Appointment
router.post("/book-appointment", patientAuth, bookAppointment);
router.get("/my-appointments", patientAuth, getMyAppointments);



console.log("Patient User Routes Loaded");
export default router;