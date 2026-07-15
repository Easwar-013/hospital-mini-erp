import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Add Doctor
export const createDoctor = async (req, res) => {
  try {
    const { 
      fullName, username, password, specialization, 
      phone, email, experience, qualification, status 
    } = req.body;

    // 1. Create the Login Account in the User collection
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: fullName,
      username,
      password: hashedPassword,
      email,
      role: "doctor",
      specialization,
      department: specialization,
    });

    // 2. Create the Doctor Profile in the Doctor collection with userId
    const lastDoctor = await Doctor.findOne().sort({ doctorId: -1 });
    let doctorId = "D001";
    if (lastDoctor && lastDoctor.doctorId) {
      const lastNumber = parseInt(lastDoctor.doctorId.substring(1));
      doctorId = `D${String(lastNumber + 1).padStart(3, "0")}`;
    }

    const doctor = await Doctor.create({
      doctorId,
      fullName,
      specialization,
      phone,
      email,
      experience,
      qualification,
      status,
      userId: user._id // Link profile to user account
    });

    res.status(201).json({ success: true, message: "Doctor Added Successfully", doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Doctor
export const updateDoctor = async (req, res) => {
  try {
    const { username, password, ...doctorData } = req.body;

    // 1. Update Doctor Profile
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, doctorData, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // 2. Update linked User account credentials if provided
    if (username || password) {
      const updateObj = { username };
      if (password) updateObj.password = await bcrypt.hash(password, 10);
      
      await User.findByIdAndUpdate(doctor.userId, updateObj);
    }

    res.status(200).json({ success: true, message: "Doctor Updated Successfully", doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctors = async (req, res) => {
  try {
    // Populate the userId to get the username for the Edit modal
    const doctors = await Doctor.find().populate('userId', 'username').sort({ createdAt: -1 });
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Doctor
export const deleteDoctor = async (req, res) => {
  try {

    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};