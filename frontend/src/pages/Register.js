import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faEnvelope,
  faLock,
  faHome,
  faSignIn,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 1000,
        onClose: () => navigate("/login"),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <ToastContainer /> {/* Toast Notification Container */}

      {/* Header */}
      <div className="register-header">
        <div className="logo">InApply</div>
        <button className="login-btn" onClick={() => navigate("/login")}>
          <FontAwesomeIcon icon={faSignIn} className="icon" />
          Login
        </button>
      </div>

      {/* Register Form */}
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div className="input-container">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <FontAwesomeIcon icon={faLock} className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">
            <FontAwesomeIcon icon={faUserPlus} className="icon" />
            Register
          </button>
        </form>

        {/* Link to Login */}
        <a href="/login" className="login-link">
          <FontAwesomeIcon icon={faSignIn} className="icon" />
          Already have an account? Login
        </a>

        <hr className="register-divider" />

        <button className="back-btn" onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHome} className="icon" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Register;
