import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// FIREBASE IMPORTS
import { auth, googleProvider, setupRecaptcha } from "../../firebase"; // Adjust path if your firebase.js is somewhere else!
import { signInWithPopup, signInWithPhoneNumber } from "firebase/auth";

import "./Login.css";

// We will create googleLoginUser and phoneLoginUser in the next step!
import {
  loginUser,
  googleLoginUser,
  phoneLoginUser,
} from "../services/userService";
import { useUserAuth } from "../context/UserAuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUserAuth();

  // UI State
  const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'phone'
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Form States
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // =====================================
  // 1. STANDARD EMAIL LOGIN
  // =====================================
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error("Please enter email and password");
    }
    try {
      const data = await loginUser(formData);
      login(data.token);

      localStorage.setItem("patientToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login Successful");
      navigate("/user/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  // =====================================
  // 2. GOOGLE SIGN IN
  // =====================================
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Send Firebase user data to OUR backend
      const data = await googleLoginUser({
        firebaseUid: user.uid,
        email: user.email,
        fullName: user.displayName,
      });

      login(data.token);

      localStorage.setItem("patientToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));


      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Google Login Successful");
      navigate("/user/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Google Sign-In Failed");
    }
  };

  // =====================================
  // 3. PHONE OTP FLOW
  // =====================================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10)
      return toast.error("Enter a valid phone number");

    try {
      // 🛠️ FIX: Clear the old reCAPTCHA memory if the user logged out and came back!
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      // Ensure phone has country code (Defaulting to India +91)
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

      const appVerifier = setupRecaptcha("recaptcha-container");
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier,
      );

      setConfirmationResult(confirmation);
      setOtpSent(true);
      toast.success("OTP Sent Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP. Try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Enter OTP");

    try {
      // Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // Send Firebase user data to OUR backend
      const data = await phoneLoginUser({
        firebaseUid: user.uid,
        phone: user.phoneNumber,
      });

      login(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Phone Login Successful");
      navigate("/user/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Invalid OTP or Login Failed");
    }
  };

  return (
    <div className="login-page-wrapper">
      <nav className="login-navbar">
        <div className="navbar-logo">🏥 CITY HOSPITAL</div>
        <button className="nav-admin-btn" onClick={() => navigate("/login")}>
          Admin Login
        </button>
      </nav>

      <div className="login-container">
        <div className="login-left">
          <div className="left-content">
            <h1>Patient Portal</h1>
            <p>
              Book appointments, manage your medical records, download bills and
              access healthcare services from anywhere.
            </p>
          </div>
        </div>

        <div className="login-right">
          <div className="right-content">
            <div className="login-card">
              <div className="hospital-icon">🏥</div>
              <h2>Welcome Back</h2>
              <p className="subtitle">Sign in to continue</p>

              {/* GOOGLE BUTTON */}
              <button
                type="button"
                className="google-btn"
                onClick={handleGoogleSignIn}
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                  alt="Google"
                />
                Sign in with Google
              </button>

              <div className="divider">
                <span>OR</span>
              </div>

              {/* LOGIN METHOD TOGGLE */}
              <div className="login-toggle">
                <button
                  className={loginMethod === "email" ? "active" : ""}
                  onClick={() => setLoginMethod("email")}
                >
                  Email
                </button>
                <button
                  className={loginMethod === "phone" ? "active" : ""}
                  onClick={() => {
                    setLoginMethod("phone");
                    setOtpSent(false);
                  }}
                >
                  Phone (OTP)
                </button>
              </div>

              {/* EMAIL FORM */}
              {loginMethod === "email" && (
                <form onSubmit={handleEmailSubmit}>
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
              )}

              {/* PHONE OTP FORM */}
              {loginMethod === "phone" && !otpSent && (
                <form onSubmit={handleSendOtp}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {/* Invisible Recaptcha needs this div! */}
                  <div id="recaptcha-container"></div>
                  <button className="login-btn">Send OTP</button>
                </form>
              )}

              {loginMethod === "phone" && otpSent && (
                <form onSubmit={handleVerifyOtp}>
                  <label>Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    placeholder="------"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    style={{
                      textAlign: "center",
                      letterSpacing: "5px",
                      fontSize: "20px",
                    }}
                  />
                  <button className="login-btn">Verify & Login</button>
                </form>
              )}

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
};;

export default Login;
