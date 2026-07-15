import { Outlet } from "react-router-dom";
import ReceptionistSidebar from "../components/layout/ReceptionistSidebar";
import Navbar from "../components/layout/Navbar";

import { FaChartPie, FaCalendarCheck, FaUserPlus } from "react-icons/fa";

const ReceptionistLayout = () => {
  // Define items specific to the receptionist's role
  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaChartPie />,
      path: "/receptionist/dashboard",
    },
    {
      name: "Appointments",
      icon: <FaCalendarCheck />,
      path: "/receptionist/appointments",
    },
    {
      name: "Register Patient",
      icon: <FaUserPlus />,
      path: "/receptionist/register-patient",
    },
  ];

  return (
    <div className="dashboard-layout">
      <ReceptionistSidebar />
      <div className="dashboard-main">
        <Navbar />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ReceptionistLayout;
