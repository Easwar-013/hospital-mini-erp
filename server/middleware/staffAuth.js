import jwt from "jsonwebtoken";
import User from "../models/User.js";

const staffAuth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "hospitalsecret");
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ success: false, message: "Forbidden: Access Denied" });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Invalid Token" });
    }
  };
};

export default staffAuth;