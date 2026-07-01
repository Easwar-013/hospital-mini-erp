import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import "./DashboardLayout.css";

const DashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        {location.pathname === "/dashboard" && <Navbar />}

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
