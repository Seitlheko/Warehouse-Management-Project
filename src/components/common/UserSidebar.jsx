import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBell,
  FaChartLine,
  FaSignOutAlt,
  FaBox,
  FaCogs,
  FaClipboardList,
  FaUserShield,
  FaWrench,
} from "react-icons/fa";
import "./Sidebar.css"; // Use the same CSS file

const UserSidebar = () => {
  const userNavItems = [
    {
      path: "/user-dashboard",
      icon: <FaHome className="icon" />,
      label: "Dashboard",
    },
    {
      path: "/orders",
      icon: <FaClipboardList className="icon" />,
      label: "Orders",
    },
    { path: "/settings", icon: <FaCogs className="icon" />, label: "Settings" },
    {
      path: "/logout",
      icon: <FaSignOutAlt className="icon" />,
      label: "Logout",
    },
  ];

  return <Sidebar userNavItems={userNavItems} />;
};

export default UserSidebar;
