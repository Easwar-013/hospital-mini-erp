import User from '../models/User.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Appointment from "../models/Appointment.js"; // You likely need this model
import Billing from "../models/Bill.js";
import Patient from "../models/Patient.js";

export const getReceptionistDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const appointmentsCount = await Appointment.countDocuments({ 
            appointmentDate: { $gte: today, $lt: tomorrow } 
        });
        
        const unpaidBills = await Billing.countDocuments({ paymentStatus: "Pending" });
        
        // Restore these queries
        const recentPatients = await Patient.find().sort({ createdAt: -1 }).limit(5);
        const todayAppointments = await Appointment.find({
            appointmentDate: { $gte: today, $lt: tomorrow }
        }).populate("patient").limit(5);
        
        res.status(200).json({
            success: true,
            stats: {
                todayAppointments: appointmentsCount,
                unpaidBills: unpaidBills,
            },
            recentPatients, // Include this
            todayAppointments // Include this
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getReceptionists = async (req, res) => {
    try {
        console.log("Logged in user:", req.user); // Check if req.user exists
        const receptionists = await mongoose.connection.db.collection("users")
            .find({ role: 'receptionist' })
            .toArray();
        res.status(200).json(receptionists);
    } catch (error) {
        console.error("Error fetching:", error); // Log the actual error
        res.status(500).json([]);
    }
};

export const addReceptionist = async (req, res) => {
    try {
        const { fullName, email, phone, password, ward, age } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Map the frontend fields to your schema fields
        const receptionistData = {
            name: fullName,           // Maps fullName to name
            username: email,          // Uses email as username
            email: email,
            password: hashedPassword,
            phone: phone,
            department: ward,         // Maps ward to department
            role: 'receptionist'
        };

        const newReceptionist = await User.create(receptionistData);
        res.status(201).json(newReceptionist);
    } catch (error) {
        if (error.code === 11000) {
            // Specifically handle duplicate key errors
            return res.status(400).json({ message: "Email already exists" });
        }
        console.error("DETAILED ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

export const updateReceptionist = async (req, res) => {
    try {
        const { name, email, phone, department, status } = req.body;
        const updated = await User.findByIdAndUpdate(
            req.params.id, 
            { name, email, phone, department, status }, // Ensure status is saved
            { new: true }
        );
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update' });
    }
};

export const deleteReceptionist = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Receptionist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete receptionist' });
    }
};