import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
    },

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

    // Ward is OPTIONAL
    ward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
      default: null,
    },

    consultationFee: {
      type: Number,
      default: 0,
    },

    wardCharge: {
      type: Number,
      default: 0,
    },

    medicineCharge: {
      type: Number,
      default: 0,
    },

    labCharge: {
      type: Number,
      default: 0,
    },

    otherCharge: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Net Banking"],
      default: "Cash",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Partially Paid"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Bill", billSchema);