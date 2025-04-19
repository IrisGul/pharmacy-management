import React, { useState } from "react";
import "../index.css";
import logo from "../assets/Logo.png";
import Register from "./Register"; // ⬅️ wichtig

const Login: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return <Register />; // ⬅️ zeigt Register-Seite, wenn true
  }

  const handleRegisterClick = () => {
    setShowRegister(true);
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
          <form>
            <label>User Name</label>
            <input type="text" placeholder="user name" />

            <label>Password</label>
            <input type="password" placeholder="password" />

            <div className="button-group">
              <button type="submit" className="btn sign-in">
                Sign In
              </button>
              <button type="button" className="btn register" onClick={handleRegisterClick}>
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
