import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    qualification: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "On Leave"],
      default: "Available",
    },

    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Doctor", doctorSchema, "doctors");