import express from "express";
import { createStaffAccount, loginStaff, getStaffList } from "../controllers/staffController.js";
import staffAuth from "../middleware/staffAuth.js";

const router = express.Router();

router.post("/login", loginStaff);
router.post("/create", staffAuth(["admin"]), createStaffAccount);
router.get("/list", staffAuth(["admin", "receptionist"]), getStaffList);

export default router;