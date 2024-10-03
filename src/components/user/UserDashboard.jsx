import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  FaHome,
  FaClipboardList,
  FaCogs,
  FaSignOutAlt,
  FaBox,
  FaCalendarAlt,
  FaFileAlt,
  FaTruck,
  FaWarehouse,
  FaUserCircle,
} from "react-icons/fa";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "../styles/user/UserDashboard.css"; // Correct path for the CSS file
import { db } from "../../firebase/firebase"; // Adjust path based on your setup
import { collection, getDocs } from "firebase/firestore";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const UserDashboard = ({ userEmail }) => {
  // Accept userEmail as a prop
  const [searchTerm, setSearchTerm] = useState("");
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [expiringSoonCount, setExpiringSoonCount] = useState(0);
  const [totalDeliveries, setTotalDeliveries] = useState(0); // State to hold total deliveries
  const [loading, setLoading] = useState(true);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchTotalStockValue = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "items")); // Fetching items
        let totalValue = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Item Document Data:", data);
          if (data.price) {
            totalValue += Number(data.price);
          }
        });

        console.log("Total Stock Value:", totalValue);
        setTotalStockValue(totalValue);
      } catch (error) {
        console.error("Error fetching total stock value: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchExpiringSoonCount = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "items"));
        let count = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const expiryDate = new Date(data.expiryDate);
          const today = new Date();
          const thirtyDaysFromNow = new Date(today);
          thirtyDaysFromNow.setDate(today.getDate() + 30);

          if (expiryDate <= thirtyDaysFromNow && expiryDate >= today) {
            count++;
          }
        });

        setExpiringSoonCount(count);
      } catch (error) {
        console.error("Error fetching expiring soon count: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTotalDeliveries = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "deliveries")); // Fetching deliveries
        setTotalDeliveries(querySnapshot.size); // Get the total number of deliveries
      } catch (error) {
        console.error("Error fetching total deliveries: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalStockValue();
    fetchExpiringSoonCount();
    fetchTotalDeliveries(); // Fetch deliveries
  }, []);

  const userNavItems = [
    {
      path: "/user-dashboard",
      icon: <FaHome className="icon" />,
      label: "Dashboard",
    },
    {
      path: "/stock-management", // Correct link for stock management
      icon: <FaBox className="icon" />,
      label: "Stock Management",
    },
    {
      path: "/deliveries",
      icon: <FaTruck className="icon" />,
      label: "Deliveries",
    },
    {
      path: "/reports",
      icon: <FaFileAlt className="icon" />,
      label: "Reports",
    },
    {
      path: "/warehouse-value",
      icon: <FaWarehouse className="icon" />,
      label: "Warehouse Value",
    },
    {
      path: "/expiry-notifications",
      icon: <FaCalendarAlt className="icon" />,
      label: "Expiry Notifications",
    },
    {
      path: "/settings",
      icon: <FaCogs className="icon" />,
      label: "Settings",
    },
    {
      path: "/logout",
      icon: <FaSignOutAlt className="icon" />,
      label: "Logout",
    },
  ];

  const pieData = {
    labels: ["Expiring Soon", "Stock Remaining", "Dispatched"],
    datasets: [
      {
        data: [expiringSoonCount, 40, 55], // Update with actual data
        backgroundColor: ["#e74c3c", "#3498db", "#2ecc71"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw} items`;
          },
        },
      },
    },
  };

  return (
    <div className="user-dashboard">
      <div className="sidebar" style={{ backgroundColor: "orange" }}>
        <input
          type="text"
          aria-label="Search"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
        <ul className="nav-list">
          {userNavItems.map((item, index) => (
            <li key={index}>
              <Link to={item.path} className="nav-link" aria-label={item.label}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="header-left">
            <h2 className="header-title" style={{ color: "white" }}>
              Warehouse Dashboard
            </h2>
          </div>
          <div className="user-info">
            <FaUserCircle className="user-icon" style={{ color: "white" }} />
            <span className="username" style={{ color: "white" }}>
              {userEmail} {/* Display the email address */}
            </span>
          </div>
        </div>

        <div className="dashboard-overview">
          <div className="card">
            <h3>Total Stock Value</h3>
            {loading ? <p>Loading...</p> : <p>${totalStockValue.toFixed(2)}</p>}
          </div>
          <div className="card">
            <h3>Deliveries This Month</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <p>{totalDeliveries} deliveries</p>
            )}{" "}
            {/* Display total deliveries */}
            <Link to="/deliveries" className="button">
              View Deliveries
            </Link>
          </div>
          <div className="card chart-container">
            <h3>Stock Distribution</h3>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        <div className="dashboard-overview">
          <div className="card">
            <h3>Expiring Soon</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <p>{expiringSoonCount} items expiring in 30 days</p>
            )}
            <Link to="/expiry-notifications" className="button">
              View Expiry Notifications
            </Link>
          </div>
          <div className="card">
            <h3>Recent Reports</h3>
            <p>2 new reports available</p>
            <Link to="/reports" className="button">
              View Reports
            </Link>
          </div>
          <div className="card">
            <h3>Manage Stock</h3>
            <p>Check and update stock levels</p>
            <Link to="/stock-management" className="button">
              Manage Stock
            </Link>
            y
          </div>
        </div>

        <footer className="footer">
          <p style={{ color: "white" }}>
            &copy; 2024 Warehouse Management System. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default UserDashboard;
