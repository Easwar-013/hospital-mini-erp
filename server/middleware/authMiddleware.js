import jwt from "jsonwebtoken";
import User from "../models/User.js";
import PatientUser from "../models/PatientUser.js";
import mongoose from "mongoose";

// Ensure 'async' is written before (req, res, next)
export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Access denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user using Mongoose models
    let user = await User.findById(decoded.id);
    if (!user) {
      user = await PatientUser.findById(decoded.id);
    }
    
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Attach user to req.user and ensure .id exists for your controller
    req.user = {
      ...user.toObject(),
      id: user._id.toString() // Explicitly map _id to id so req.user.id works
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check using req.user.role (assuming roles are stored on the user document)
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized access" 
      });
    }
    next();
  };
};