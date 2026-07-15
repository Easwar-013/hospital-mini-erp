import { useState } from "react";
import { FaEye, FaEyeSlash, FaHospital } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/axios";

import "./LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const data = response.data;

      // Save login data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update authentication state
      login();

      toast.success(data.message);

      // 🚦 THE TRAFFIC COP (ROLE-BASED REDIRECT)
      if (data.user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (data.user.role === "receptionist") {
        navigate("/receptionist/dashboard");
      } else {
        navigate("/dashboard"); // Admins go here!
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-card">
      <div className="login-logo">
        <FaHospital />
      </div>

      <h2>Welcome Back</h2>

      <p>Sign in to continue</p>

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button className="login-btn">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
