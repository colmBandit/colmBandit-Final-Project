import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faSignInAlt,
  faUserPlus,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 1000,
        onClose: () => navigate("/dashboard"),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer /> {/* Toast container for notifications */}

      {/* Top Header */}
      <div className="login-header">
        <div className="logo">InApply</div>
        <button className="signup-btn" onClick={() => navigate("/register")}>
          <FontAwesomeIcon icon={faUserPlus} className="icon" />
          Sign Up
        </button>
      </div>

      {/* Login Box */}
      <div className="login-box">
        <h2>Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-container">
            <FontAwesomeIcon icon={faLock} className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">
            <FontAwesomeIcon icon={faSignInAlt} className="icon" />
            Login
          </button>
        </form>

        <a href="/register" className="register-link">
          <FontAwesomeIcon icon={faUserPlus} className="icon" />
          Create an Account
        </a>

        <hr className="login-divider" />

        <button className="back-btn" onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHome} className="icon" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Login;
