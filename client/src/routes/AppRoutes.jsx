import { Routes, Route, Navigate } from "react-router-dom";

// Auth & Layouts
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "../components/RoleRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import DoctorLayout from "../layouts/DoctorLayout";
import ReceptionistLayout from "../layouts/ReceptionistLayout";

// Admin Pages
import Dashboard from "../pages/dashboard/Dashboard";
import Patients from "../pages/patients/Patients";
import Doctors from "../pages/doctors/Doctors";
import Receptionists from "../pages/receptionists/Receptionists"; // Admin management page
import Appointments from "../pages/appointments/Appointments";
import Billing from "../pages/billing/Billing";
import Settings from "../pages/settings/Settings";
import WardManagement from "../pages/Wards/WardManagement";
import Announcement from "../pages/announcement/Announcement";

// Staff/User Pages
import UserRoutes from "../user/routes/UserRoutes";
import DoctorDashboard from "../pages/staff/DoctorDashboard";
import DoctorAppointments from "../pages/staff/Appointments";
import MyPatients from "../pages/staff/MyPatients";
import Availability from "../pages/staff/Schedule";
import DoctorProfile from "../pages/staff/Profile";


import ReceptionistDashboard from "../pages/receptionist/ReceptionistDashboard";
import ReceptionistAppointments from "../pages/receptionist/ReceptionistAppointments";
import RegisterPatient from "../pages/receptionist/RegisterPatient";
import ReceptionistAnnouncements from "../pages/receptionist/ReceptionistAnnouncements";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/user/login" replace />} />
      <Route path="/user/*" element={<UserRoutes />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Doctor Routes */}
      <Route path="/doctor/*" element={<RoleRoute allowedRoles={["doctor"]} />}>
        <Route element={<DoctorLayout />}>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="patients" element={<MyPatients />} />
          <Route path="schedule" element={<Availability />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>
      </Route>

      {/* Receptionist Portal Routes */}
      <Route
        path="/receptionist/*"
        element={<RoleRoute allowedRoles={["receptionist", "admin"]} />}
      >
        <Route element={<ReceptionistLayout />}>
          <Route path="dashboard" element={<ReceptionistDashboard />} />
          <Route path="appointments" element={<ReceptionistAppointments />} />
          <Route path="register-patient" element={<RegisterPatient />} />
          <Route path="announcements" element={<ReceptionistAnnouncements />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/receptionists" element={<Receptionists />} />{" "}
        {/* Admin management page */}
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/wards" element={<WardManagement />} />
        <Route path="/announcements" element={<Announcement />} />
      </Route>

      {/* Invalid Route */}
      <Route path="*" element={<Navigate to="/user/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
