import mongoose from "mongoose";

const wardSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    wardName: {
      type: String,
      required: true,
    },

    bedNumber: {
      type: String,
      required: true,
    },

    admissionDate: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Occupied", "Available", "Maintenance"],
      default: "Occupied",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Ward", wardSchema);