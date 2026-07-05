import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// Point this to your new User-specific CSS file
import "./UserLayout.css";

const UserLayout = () => {
  return (
    <div className="user-layout-wrapper">
      <Sidebar />

      <div className="user-layout-main">
        <Navbar />

        <div className="user-layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
