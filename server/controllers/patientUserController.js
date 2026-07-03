import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import PatientUser from "../models/PatientUser.js";
import Patient from "../models/Patient.js";
// Register
export const registerPatient = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const exists = await PatientUser.findOne({
      $or: [{ email }, { phone }],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await PatientUser.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });

    // Create Hospital Patient Record
    // Generate Patient ID
const lastPatient = await Patient.findOne().sort({ patientId: -1 });

let patientId = "P001";

if (lastPatient) {
  const lastNumber = parseInt(lastPatient.patientId.substring(1));

  patientId = `P${String(lastNumber + 1).padStart(3, "0")}`;
}

// Create Hospital Patient Record
const patient = await Patient.create({
  patientId,
  fullName,
  age: 0,
  gender: "Male",
  phone,
  doctor: "Not Assigned",
  bloodGroup: "O+",
  status: "Out Patient",
  address: "Not Provided",
});

    // Link PatientUser to Patient
    user.patient = patient._id;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Login
export const loginPatient = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await PatientUser.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "hospitalsecret",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Profile
export const getProfile = async (req, res) => {

  res.json({
    success: true,
    user: req.user,
  });

};