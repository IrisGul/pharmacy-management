import React from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="dashboard-page">
      
      {/* Kopfzeile */}
      <div className="header-container">
        <img src="/assets/logo.png" alt="Logo" className="logo" />
        <div className="search-bar">
          <input type="text" placeholder="Finden Sie Ihr Produkt" />
          <button className="search-button">Search...</button>
          
        </div>
        <div className="user-options">
          <a href="/login">Logout</a>

        </div>
      </div>

      {/* Navigationsleiste */}
      <div className="navbar">
        <div className="menu-icon">☰</div>
        <a href="#">Categories</a>
        <a href="#"> Medicines</a>
        <a href="#">Family</a>
        <a href="#">Beauty & Care</a>
        <a href="#">Own Brands</a>
        <a href="#">New</a>
        <a href="#">Sales</a>
        <a href="#">RedPoints</a>
        <a href="#"onClick={() => navigate("/productlist")}>Product List </a>   {/*navigieren*/}
       
        <a href="#">Sell Medicines</a>
      </div>

      {/* Inhalt */}
      <div className="dashboard-content">
        <h2>Welcome to the Pharmacy Dashboard</h2>
        <p>Here you can view the product list or sell medicine.</p>
        {/* Weitere Komponenten hier einfügen */}
      </div>
    </div>
  );
};

export default Dashboard;
