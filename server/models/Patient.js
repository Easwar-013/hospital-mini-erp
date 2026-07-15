import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: false, // Set to false if existing patients don't have emails
    },

    doctor: {
      type: String,
      required: true,
    },

    bloodGroup: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Admitted", "Out Patient", "Discharged"],
      default: "Admitted",
    },

    address: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientUser"
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Patient", patientSchema, "patients");