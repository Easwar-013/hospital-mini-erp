import jwt from "jsonwebtoken";
import PatientUser from "../models/PatientUser.js";

const patientAuth = async (req, res, next) => {
  try {
    console.log("======== PATIENT AUTH ========");

    console.log("Authorization Header:");
    console.log(req.headers.authorization);

    const token = req.headers.authorization?.split(" ")[1];

    console.log("Token:");
    console.log(token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "hospitalsecret"
    );

    console.log("Decoded:");
    console.log(decoded);

    const user = await PatientUser.findById(decoded.id);

    console.log("User:");
    console.log(user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
  console.log("========== JWT ERROR ==========");
  console.log(error.name);
  console.log(error.message);
  console.log(error);

  res.status(401).json({
    success: false,
    message: error.message,
  });
}
};

export default patientAuth;