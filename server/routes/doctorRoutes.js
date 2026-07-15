import express from "express";
import Doctor from "../models/Doctor.js";
import {
  createDoctor,
  getDoctors,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();



// Availability toggle route
router.put("/update-availability", verifyUser, async (req, res) => {
  console.log("--- DEBUG START ---");
  console.log("Request User ID:", req.user?._id);
  
  try {
    const userId = req.user._id;
    const { status } = req.body;
    
    console.log("Updating status to:", status, "for userId:", userId);

    const doctor = await Doctor.findOneAndUpdate(
      { userId: userId },
      { $set: { status: status } },
      { new: true }
    );
    
    console.log("Doctor Update Result:", doctor);

    if (!doctor) {
      console.log("Error: Doctor not found in DB");
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({ success: true, status: doctor.status });
  } catch (error) {
    console.error("--- DEBUG CRASH ---", error);
    res.status(500).json({ success: false, message: "Server crash" });
  }
});

// Profile fetch route
router.get("/profile", verifyUser, async (req, res) => {
  try {
    // FIX: Access _id from the user document
    const doctor = await Doctor.findOne({ userId: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add this to your doctorRoutes.js
router.put("/profile/update", verifyUser, async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ success: true, doctor: updatedDoctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Existing routes
router.post("/", createDoctor);
router.get("/", getDoctors);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;