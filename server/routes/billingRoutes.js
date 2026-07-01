import express from "express";

import {
  createBill,
  getBills,
  updateBill,
  deleteBill,
} from "../controllers/billingController.js";

const router = express.Router();

// Create Bill
router.post("/", createBill);

// Get All Bills
router.get("/", getBills);

// Update Bill
router.put("/:id", updateBill);

// Delete Bill
router.delete("/:id", deleteBill);

export default router;