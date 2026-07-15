import express from 'express';
import { getReceptionists, addReceptionist, deleteReceptionist, updateReceptionist } from '../controllers/receptionistController.js';
import { verifyUser, authorize } from '../middleware/authMiddleware.js';
import { getReceptionistDashboardStats } from "../controllers/receptionistController.js";

const router = express.Router();

router.get("/dashboard-stats", verifyUser, authorize('receptionist', 'admin'), getReceptionistDashboardStats);

router.route('/')
    .get(verifyUser, authorize('admin'), getReceptionists)
    .post(verifyUser, authorize('admin'), addReceptionist);

router.route('/:id')
    .put(verifyUser, authorize('admin'), updateReceptionist)
    .delete(verifyUser, authorize('admin'), deleteReceptionist);

export default router;