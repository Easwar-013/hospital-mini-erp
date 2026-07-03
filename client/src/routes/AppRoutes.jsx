import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/dashboard/Dashboard";
import Patients from "../pages/patients/Patients";
import Doctors from "../pages/doctors/Doctors";
import Appointments from "../pages/appointments/Appointments";
import Billing from "../pages/billing/Billing";
import Settings from "../pages/settings/Settings";
import WardManagement from "../pages/Wards/WardManagement";
import Announcement from "../pages/announcement/Announcement";

import UserRoutes from "../user/routes/UserRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default Route → Patient Login */}
      <Route path="/" element={<Navigate to="/user/login" replace />} />

      {/* User Module */}
      <Route path="/user/*" element={<UserRoutes />} />

      {/* Admin Login */}
      <Route path="/login" element={<Login />} />

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
