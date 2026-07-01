import express from "express";

import {
  createWard,
  getWards,
  updateWard,
  deleteWard,
} from "../controllers/wardController.js";

const router = express.Router();

// Create Ward Assignment
router.post("/", createWard);

// Get All Ward Assignments
router.get("/", getWards);

// Update Ward Assignment
router.put("/:id", updateWard);

// Delete Ward Assignment
router.delete("/:id", deleteWard);

export default router;