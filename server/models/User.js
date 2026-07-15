import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      
      type: String,
      required: true,
    },
    phone: { 
      type: String,
      required: true,
     },
    role: {
      type: String,
      enum: ["admin", "doctor", "receptionist"],
      default: "admin",
    },
    specialization: {
      type: String,
      required: function () {
        return this.role === "doctor";
      },
    },
    department: {
      type: String,
      required: function () {
        return this.role === "doctor" || this.role === "receptionist";
      },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"], // Restrict values
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema, "users");

export default User;