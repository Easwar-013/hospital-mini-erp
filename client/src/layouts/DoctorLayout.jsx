import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";



const DoctorLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    toast.info("Logged out successfully");
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <h2 style={{ padding: "20px 0", borderBottom: "1px solid #1e293b" }}>
          City Hospital
        </h2>
        <ul>
          <li>
            <NavLink to="/doctor/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/doctor/appointments">Appointments</NavLink>
          </li>
          <li>
            <NavLink to="/doctor/patients">My Patients</NavLink>
          </li>
          <li>
            <NavLink to="/doctor/schedule">Availability</NavLink>
          </li>
          <li>
            <NavLink to="/doctor/profile">Profile</NavLink>
          </li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <div className="main-content">
        <header className="navbar">Doctor Portal</header>
        <div className="page-padding">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DoctorLayout;
