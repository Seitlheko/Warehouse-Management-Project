// src/components/common/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/common/sidebar.css"; // Add your own CSS styling here

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/stock-management">Stock Management</Link>
        </li>
        <li>
          <Link to="/deliveries">Deliveries</Link>
        </li>
        <li>
          <Link to="/reports">Reports</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
