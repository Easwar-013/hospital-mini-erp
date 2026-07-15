import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"; // IMPORT HTTP
import { Server } from "socket.io";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import wardRoutes from "./routes/wardRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import connectDB from "./config/db.js";
import patientUserRoutes from "./routes/patientUserRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import Patient from "./models/Patient.js"; 
import PatientUser from "./models/PatientUser.js";
import receptionistRoutes from './routes/receptionistRoutes.js';

dotenv.config();

connectDB();

const app = express();



// ==========================================
// SOCKET.IO SETUP
// ==========================================
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allows your frontend to connect safely
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Make 'io' globally accessible to all your controllers!
app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ A user connected to real-time updates!");
  
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
// ==========================================

// Middleware
app.use(cors({
  origin: "https://hospital-mini-erp-zeta.vercel.app", // Be specific instead of "*"
  credentials: true
}));
app.use(express.json());
app.use("/api/staff", staffRoutes);

// Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/wards", wardRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/patient-user", patientUserRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use('/api/receptionists', receptionistRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hospital Mini ERP Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

// CRITICAL: Use server.listen instead of app.listen!
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

console.log("Patient User Route Imported");