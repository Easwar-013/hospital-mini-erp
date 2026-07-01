import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const exists = await User.findOne({
      username: "admin",
    });

    if (exists) {
      console.log("✅ Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Administrator",
      username: "admin",
      email: "admin@hospital.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin Created Successfully");

    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

createAdmin();