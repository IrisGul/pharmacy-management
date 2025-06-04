import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "../index.css";
import logo from "../assets/Logo.png";
import Register from "./Register";

const Login: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  if (showRegister) {
    return <Register />;
  }

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      // 🔐 Später echte Login-Logik einbauen
      navigate("/"); // ✅ zum Layout (Startseite)
    } else {
      alert("Bitte Benutzernamen und Passwort eingeben.");
    }
  };

  return (
    <div className="login-container">
      {/* Linke Seite */}
      <div className="login-left">
        <img src={logo} alt="Logo" className="logo-img" />
        <p className="system-name">Pharmacy Management System</p>
      </div>

      {/* Rechte Seite */}
      <div className="login-right">
        <div className="login-box">
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <label>User Name</label>
            <input
              type="text"
              placeholder="user name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="button-group">
              <button type="submit" className="btn sign-in">
                Sign In
              </button>
              <button
                type="button"
                className="btn register"
                onClick={handleRegisterClick}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
