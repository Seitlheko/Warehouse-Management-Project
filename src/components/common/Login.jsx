import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase"; // Import the auth instance
import { signInWithEmailAndPassword } from "firebase/auth"; // Import sign-in method
import "../styles/common/Login.css"; // Import the CSS file

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use email as username, you might want to adjust this based on your Firebase setup
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );

      // Check user role and navigate accordingly
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      alert("Error logging in: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="welcome-title">Warehouse Management System Welcome!</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i>
            </label>
            <input
              type="text"
              id="username"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role selection dropdown */}
          <div className="form-group">
            <label htmlFor="role">Login As:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="role-select"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <div className="links">
            <Link to="/register" className="action-link">
              Register Account
            </Link>
            <Link to="/forgot-password" className="action-link">
              Forgot Password?
            </Link>
            <Link to="/help" className="action-link">
              Help
            </Link>
          </div>
        </form>

        <footer className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </footer>
      </div>
    </div>
  );
};

export default Login;
