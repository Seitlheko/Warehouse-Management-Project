// src/components/common/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom"; // Ensure you have react-router-dom installed

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Warehouse Management</h2>
      <ul className="sidebar-links">
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
          <Link to="/users">User Management</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar; // Ensure default export
