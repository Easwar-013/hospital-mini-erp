import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import wardRoutes from "./routes/wardRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";

import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/wards", wardRoutes);
app.use("/api/billing", billingRoutes);


// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hospital Mini ERP Backend Running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});