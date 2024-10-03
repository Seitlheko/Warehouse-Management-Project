import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserDashboard from "./components/user/UserDashboard";
import StockManagement from "./components/user/stock-management"; // Import StockManagement
import Deliveries from "./components/user/deliveries"; // Import Deliveries component
import DeliveryHistory from "./components/user/delivery-history"; // Import DeliveryHistory component
import Reports from "./components/user/reports"; // Import Reports component
import ExpiryNotifications from "./components/user/expiry-notifications"; // Import ExpiryNotifications component
import Login from "./components/common/Login"; // Updated Login component import path
import NotFoundPage from "./components/pages/NotFoundPage"; // Import NotFoundPage for 404 errors
import WarehouseValue from "./components/user/warehouse-value"; // Import WarehouseValue component
import "./components/styles/global.css"; // Import global styles if needed

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route for the Login Page */}
        <Route path="/" element={<Login />} />
        {/* Route for the Admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* Route for the User Dashboard */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        {/* Route for the Stock Management page */}
        <Route path="/stock-management" element={<StockManagement />} />
        {/* Route for the Deliveries page */}
        <Route path="/deliveries" element={<Deliveries />} />
        {/* Route for the Delivery History page */}
        <Route path="/delivery-history" element={<DeliveryHistory />} />
        {/* Route for the Reports page */}
        <Route path="/reports" element={<Reports />} />
        {/* Route for the Expiry Notifications page */}
        <Route path="/expiry-notifications" element={<ExpiryNotifications />} />
        {/* Route for the Warehouse Value page */}
        <Route path="/warehouse-value" element={<WarehouseValue />} />{" "}
        {/* Added Route for Warehouse Value */}
        {/* Route for handling 404 errors */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
