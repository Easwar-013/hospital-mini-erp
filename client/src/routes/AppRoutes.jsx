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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
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
      </Route>

      {/* Invalid Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
