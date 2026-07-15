import express from "express";
import {
  createAppointment,
  getDoctorAppointments,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
  getDoctorDashboardAppointments,
  getMyAppointments, // ADDED
  bookAppointment,   // ADDED
} from "../controllers/appointmentController.js";

import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createAppointment);
router.post("/book", verifyUser, bookAppointment); // ADDED
router.get("/", getAllAppointments);
router.get("/my-appointments", verifyUser, getMyAppointments); // ADDED
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);
router.get("/doctor/:doctorId", getDoctorAppointments);
router.get("/doctor-dashboard", verifyUser, getDoctorDashboardAppointments);

export default router;