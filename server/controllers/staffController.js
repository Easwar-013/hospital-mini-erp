import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const createStaffAccount = async (req, res) => {
  try {
    const { username, password, role, fullName, email, specialization, department } = req.body;

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await User.create({
      username,
      password: hashedPassword,
      role,
      fullName,
      email,
      specialization,
      department,
    });

    res.status(201).json({ success: true, message: "Staff account created successfully", staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginStaff = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "hospitalsecret", {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStaffList = async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ["doctor", "receptionist"] } }).select("-password");
    res.status(200).json({ success: true, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};