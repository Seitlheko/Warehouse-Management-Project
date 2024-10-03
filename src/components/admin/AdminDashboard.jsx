// src/components/admin/AdminDashboard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBell,
  FaChartLine,
  FaSignOutAlt,
  FaBox,
  FaCogs,
  FaSearch,
  FaClipboardList,
  FaUserShield,
  FaWrench,
} from "react-icons/fa";
import "../styles/admin/AdminDashboard.css"; // Updated import path

const AdminDashboard = () => {
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle search input changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Navigation items
  const navItems = [
    {
      path: "/admin-dashboard",
      icon: <FaHome className="icon" />,
      label: "Dashboard",
    },
    {
      path: "/user-profile",
      icon: <FaUser className="icon" />,
      label: "User Profile",
    },
    {
      path: "/notifications",
      icon: <FaBell className="icon" />,
      label: "Notifications",
    },
    {
      path: "/analytics",
      icon: <FaChartLine className="icon" />,
      label: "Analytics",
    },
    {
      path: "/inventory",
      icon: <FaBox className="icon" />,
      label: "Inventory",
    },
    {
      path: "/reports",
      icon: <FaClipboardList className="icon" />,
      label: "Reports",
    },
    { path: "/settings", icon: <FaCogs className="icon" />, label: "Settings" },
    {
      path: "/logout",
      icon: <FaSignOutAlt className="icon" />,
      label: "Logout",
    },
  ];

  // Filtered navigation items based on search term
  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Warehouse Management System</h2>
        </div>
        <div className="logo">
          <FaHome className="logo-icon" />
        </div>
        <ul>
          {filteredNavItems.map((item, index) => (
            <li key={index}>
              <Link to={item.path}>
                {item.icon} {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <div className="header-title">Admin Dashboard</div>
          <div className="header-right">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FaSearch className="search-icon" />
            </div>
            <div className="username">
              <span>Mahlomola Seitlheko</span>
              <FaUser className="user-icon" />
            </div>
          </div>
        </div>

        {/* Dashboard Overview */}
        <div className="dashboard-overview">
          <div className="dashboard-card">
            <div className="icon">
              <FaBox />
            </div>
            <h3>Total Inventory Items</h3>
            <p>1200 Items</p>
            <Link to="/inventory" className="button">
              View Inventory
            </Link>
          </div>
          <div className="dashboard-card">
            <div className="icon">
              <FaBell />
            </div>
            <h3>Notifications</h3>
            <p>3 New Alerts</p>
            <Link to="/notifications" className="button">
              View Notifications
            </Link>
          </div>
          <div className="dashboard-card">
            <div className="icon">
              <FaChartLine />
            </div>
            <h3>Recent User Activities</h3>
            <p>Last 30 Days</p>
            <Link to="/analytics" className="button">
              View Metrics
            </Link>
          </div>
          <div className="dashboard-card">
            <div className="icon">
              <FaUserShield />
            </div>
            <h3>User Management</h3>
            <p>Manage User Accounts and Roles</p>
            <Link to="/users" className="button">
              Manage Users
            </Link>
          </div>
          <div className="dashboard-card">
            <div className="icon">
              <FaClipboardList />
            </div>
            <h3>Pending Orders</h3>
            <p>45 Orders</p>
            <Link to="/orders" className="button">
              View Orders
            </Link>
          </div>
          <div className="dashboard-card">
            <div className="icon">
              <FaWrench />
            </div>
            <h3>System Maintenance</h3>
            <p>Operational Status</p>
            <Link to="/maintenance" className="button">
              View Status
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>&copy; 2024 Warehouse Management System. All Rights Reserved.</p>
          <p>
            For support, contact{" "}
            <a href="mailto:mahlomola_seitlheko@wvi.org">
              mahlomola_seitlheko@wvi.org
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
