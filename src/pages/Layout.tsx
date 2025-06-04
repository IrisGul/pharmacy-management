import { useNavigate } from "react-router-dom";
import React from "react";
import { useSearch } from "../context/SearchContext";
import Logo from "../assets/Logo.png";
import "../index.css";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <div className="dashboard-page">
      {/* Kopfzeile */}
      <div className="header-container">
        <img src={Logo} alt="Logo" className="logo" />
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="search-button"
            style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
          >
            Search...
          </button>
        </div>
        <div className="user-options">
          <a href="/login">Logout</a>
        </div>
      </div>

      {/* Navigationsleiste */}
      <div className="navbar">
        <div className="menu-icon">☰</div>
        <a href="#">Categories</a>
        <a href="#">Medicines</a>
        <a href="#">Family</a>
        <a href="#">Beauty & Care</a>
        <a href="#">Own Brands</a>
        <a href="#">New</a>
        <a href="#">Sales</a>
        <a href="#">RedPoints</a>
        <a href="#" onClick={() => navigate("/productlist")}>
          Product List
        </a>
        <a href="#" onClick={() => navigate("/sellmedicine")}>
          Sell Medicines
        </a>
      </div>

      {/* Seiteninhalt */}
      <div className="layout-content">
        {children ? (
          children
        ) : (
          <>
            <h2>Welcome to the Pharmacy Dashboard</h2>
            <p>Here you can view the product list or sell medicine.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Layout;
