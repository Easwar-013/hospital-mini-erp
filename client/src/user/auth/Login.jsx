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

      // 1. Pass the token to your Auth Context
      login(data.token);

      // 2. ADD THIS LINE: Save the user data to localStorage so the Navbar can read it!
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login Successful");

      navigate("/user/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-container">
      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="left-content">
          <h1>🏥 CITY HOSPITAL</h1>

          <h2>Patient Portal</h2>

          <p>
            Book appointments, manage your medical records, download bills and
            access healthcare services from anywhere.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      {/* RIGHT PANEL */}

      <div className="login-right">
        <div className="right-content">
          {/* Top Header */}
          <div className="top-nav">
            <span className="admin-text">Hospital Staff?</span>

            <button className="admin-btn" onClick={() => navigate("/login")}>
              Admin Login
            </button>
          </div>

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
  );
};

export default Login;
