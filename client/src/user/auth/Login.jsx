import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./Login.css";

import { loginUser } from "../services/userService";
import { useUserAuth } from "../context/UserAuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUserAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const data = await loginUser(formData);

      login(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login Successful");

      navigate("/user/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* NEW TOP NAVBAR */}
      <nav className="login-navbar">
        <div className="navbar-logo">🏥 CITY HOSPITAL</div>
        <button className="nav-admin-btn" onClick={() => navigate("/login")}>
          Admin Login
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <div className="login-container">
        {/* LEFT PANEL */}
        <div className="login-left">
          <div className="left-content">
            <h1>Patient Portal</h1>
            <p>
              Book appointments, manage your medical records, download bills and
              access healthcare services from anywhere.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right">
          <div className="right-content">
            {/* Login Card */}
            <div className="login-card">
              <div className="hospital-icon">🏥</div>

              <h2>Welcome Back</h2>
              <p className="subtitle">Sign in to continue</p>

              <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button className="login-btn">Login</button>
              </form>

              <p className="register-text">
                Don't have an account?
                <Link to="/user/register"> Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
