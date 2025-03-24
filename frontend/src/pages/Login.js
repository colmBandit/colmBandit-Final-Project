import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faUserPlus, faEnvelope, faLock, faHome } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
    {/* Header with Logo & Sign-up Button */}
    <div className="login-header">
      <div className="logo">InApply</div>
      <button className="signup-btn" onClick={() => navigate("/register")}>
        <FontAwesomeIcon icon={faUserPlus} className="icon" />
        Sign Up
      </button>
    </div>
  
    {/* Login Form */}
    <div className="login-box">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
          <FontAwesomeIcon icon={faSignIn} className="icon" />
          Login
        </button>
      </form>
  
      {/* Link to Register */}
      <a href="/register" className="register-link">
        <FontAwesomeIcon icon={faUserPlus} className="icon" />
        Create an Account
      </a>
  
      {/* Back to Home Button */}
      <button className="back-btn" onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faHome} className="icon" />
        Back to Home
      </button>
    </div>
  </div>
  
  );
};

export default Login;
