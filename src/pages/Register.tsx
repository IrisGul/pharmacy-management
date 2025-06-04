import React, { useState } from "react";
import "../index.css"; // zentrale CSS-Datei
import logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "User",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleRegister = () => {
    // Hier machst du die Registrierung (z.B. API-Aufruf)
    // Wenn erfolgreich:
    navigate("/productlist"); // ➡️ Gehe zum Dashboard
  };

  const [passwordStrength, setPasswordStrength] = useState("");
  const [showModal, setShowModal] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setPasswordStrength(checkStrength(value));
    }
  };

  const checkStrength = (password: string): string => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < 4 || !hasUpper || !hasLower || !hasNumber)
      return "weak";
    if (password.length >= 4 && password.length <= 6) return "medium";
    if (password.length > 6) return "strong";
    return "";
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "red";
      case "medium":
        return "orange";
      case "strong":
        return "green";
      default:
        return "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // 🔒 Backend-Logik:
    // - Validierung der Eingaben (Sicherheit)
    // - E-Mail auf Existenz prüfen
    // - Passwort gehasht speichern
    // - Nutzerrolle setzen
    // - User in Datenbank speichern

    console.log("Form sent to backend: ", form);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="register-container">
      <button className="close-button" onClick={handleClose}>
        ✖
      </button>
      <img src={logo} alt="Logo" className="register-logo" />
      <h2>Register Account</h2>

      <form onSubmit={handleSubmit}>
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
        />

        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="User">User</option>
          <option value="Pharmacist">Pharmacist</option>
          <option value="Admin">Admin</option>
        </select>

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <small>
          Must be at least 4 characters, include uppercase, lowercase, and
          numbers.
        </small>
        {form.password && (
          <div
            className="strength-bar"
            style={{ backgroundColor: getStrengthColor() }}
          >
            {passwordStrength.toUpperCase()}
          </div>
        )}

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" onClick={handleRegister}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
