import express from "express";
import {
  bookAppointment,
  getMyAppointments,
} from "../controllers/appointmentController.js";

import patientAuth from "../middleware/patientAuth.js";

const router = express.Router();

router.post("/book-appointment", patientAuth, bookAppointment);

router.get("/my-appointments", patientAuth, getMyAppointments);

export default router;