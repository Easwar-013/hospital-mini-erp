import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./Register.css";

import { registerUser } from "../services/userService";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      toast.success("Registration Successful");

      navigate("/user/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="login-page">
      {/* Left Side */}
      <div className="login-left">
        <div className="left-content">
          <h1>🏥 CITY HOSPITAL</h1>

          <h2>Create Patient Account</h2>

          <p>
            Register to book appointments, download invoices, manage your
            medical records and securely access hospital services anytime.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <div className="auth-card">
          <div className="login-icon">🏥</div>

          <h2>Create Account</h2>

          <span className="subtitle">Register to continue</span>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="auth-btn">
              Register
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?
            <Link to="/user/login"> Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
