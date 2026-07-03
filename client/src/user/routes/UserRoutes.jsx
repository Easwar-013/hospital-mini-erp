import { Routes, Route } from "react-router-dom";

import Login from "../auth/Login";
import Register from "../auth/Register";

import UserLayout from "../layouts/UserLayout";

import Dashboard from "../pages/Dashboard";
import Bills from "../pages/Bills";
import BookAppointment from "../pages/BookAppointment";
import MyAppointments from "../pages/MyAppointments";
import Profile from "../pages/Profile";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route element={<UserLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="book-appointment" element={<BookAppointment />} />
        <Route path="my-appointments" element={<MyAppointments />} />
        <Route path="bills" element={<Bills />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
