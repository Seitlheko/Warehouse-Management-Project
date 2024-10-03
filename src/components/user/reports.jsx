import React, { useState, useEffect } from "react";
import {
  FaDownload,
  FaFilePdf,
  FaFileExcel,
  FaChartLine,
  FaArrowLeft,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Firebase imports
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/user/reports.css";

// Initialize Firebase Firestore
const db = getFirestore();

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [reportData, setReportData] = useState({
    stockLevels: [],
    deliveries: [],
    warehouseCapacities: [],
    prices: {},
  });
  const [loading, setLoading] = useState(true);

  // Format stock value in dollars
  const formatCurrency = (value) => `$${value.toLocaleString()}`;

  // Fetch stock, delivery, warehouse capacity, and item price data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockSnapshot = await getDocs(collection(db, "stockLevels"));
        const deliverySnapshot = await getDocs(collection(db, "deliveries"));
        const capacitySnapshot = await getDocs(
          collection(db, "warehouseCapacities")
        );
        const itemsSnapshot = await getDocs(collection(db, "items")); // Fetch item prices

        const stockData = stockSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const deliveryData = deliverySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const capacityData = capacitySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const pricesData = {};
        itemsSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          pricesData[data.productId] = data.price; // Assuming there's a productId field in the items collection
        });

        // Calculate stock values based on prices
        const updatedStockData = stockData.map((item) => ({
          ...item,
          stockValue: item.stockLevel * (pricesData[item.productId] || 0), // Calculate stock value
        }));

        console.log("Fetched stock levels:", updatedStockData); // Debugging line to check data

        setReportData({
          stockLevels: updatedStockData,
          deliveries: deliveryData,
          warehouseCapacities: capacityData,
          prices: pricesData,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWarehouseChange = (event) => {
    setSelectedWarehouse(event.target.value);
    console.log("Selected warehouse:", event.target.value); // Debugging line to check state update
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Stock Levels Report", 20, 10);
    autoTable(doc, {
      head: [["Warehouse", "Stock Level", "Stock Value"]],
      body: reportData.stockLevels
        .filter(
          (item) =>
            item.warehouse === selectedWarehouse || selectedWarehouse === ""
        )
        .map((item) => [
          item.warehouse,
          item.stockLevel,
          formatCurrency(item.stockValue),
        ]),
    });

    doc.addPage();
    doc.text("Deliveries Report", 20, 10);
    autoTable(doc, {
      head: [["Delivery ID", "Destination", "Driver", "Status"]],
      body: reportData.deliveries.map((item) => [
        item.id,
        item.destination,
        item.driver,
        item.status,
      ]),
    });

    doc.save("reports.pdf");
  };

  const downloadExcel = () => {
    alert(
      "The Excel download feature is currently being developed and will be available soon!"
    );
  };

  const showConsolidatedReports = () => {
    alert(
      "The consolidated reports feature is currently being developed and will be available soon!"
    );
  };

  if (loading) {
    return <p className="loading-message">Loading data, please wait...</p>;
  }

  // Get unique warehouse names from stockLevels
  const warehouseOptions = [
    ...new Set(reportData.stockLevels.map((item) => item.warehouse)),
  ];

  // Chart Data for Stock Levels
  const stockChartData = {
    labels: reportData.stockLevels.map((item) => item.warehouse),
    datasets: [
      {
        label: "Stock Level",
        data: reportData.stockLevels.map((item) => item.stockLevel),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Chart Data for Delivery Volume
  const deliveryChartData = {
    labels: reportData.deliveries.map((item) => item.destination),
    datasets: [
      {
        label: "Number of Deliveries",
        data: reportData.deliveries.map(() => 1), // Simplified for demo
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  // Chart Data for Warehouse Utilization
  const warehouseUtilizationData = {
    labels: reportData.warehouseCapacities.map((item) => item.warehouse),
    datasets: [
      {
        label: "Used Capacity",
        data: reportData.warehouseCapacities.map((item) => item.usedCapacity),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
      {
        label: "Total Capacity",
        data: reportData.warehouseCapacities.map((item) => item.totalCapacity),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <div className="reports">
      <aside className="sidebar">
        <button
          className="btn-sidebar"
          onClick={() => {
            // TODO: Implement navigation to Dashboard
          }}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className="filter-section">
          <label htmlFor="warehouse-select">Select Warehouse:</label>
          <select
            id="warehouse-select"
            onChange={handleWarehouseChange}
            value={selectedWarehouse}
          >
            <option value="">All Warehouses</option>
            {warehouseOptions.length > 0 ? (
              warehouseOptions.map((warehouse, index) => (
                <option key={index} value={warehouse}>
                  {warehouse}
                </option>
              ))
            ) : (
              <option disabled>No warehouses available</option>
            )}
          </select>
        </div>
        <div className="report-actions">
          <button className="btn-download" onClick={downloadPDF}>
            <FaFilePdf /> Download PDF
          </button>
          <button className="btn-download" onClick={downloadExcel}>
            <FaFileExcel /> Download Excel
          </button>
          <button className="btn-view-graphs" onClick={showConsolidatedReports}>
            <FaChartLine /> View Consolidated Reports
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>Reports</h1>
        </header>

        <section id="stock-levels">
          <h2>Stock Levels</h2>
          <Bar data={stockChartData} />
          <table className="report-table">
            <thead>
              <tr>
                <th>Warehouse</th>
                <th>Stock Level</th>
                <th>Stock Value (in $)</th>
              </tr>
            </thead>
            <tbody>
              {reportData.stockLevels
                .filter(
                  (item) =>
                    item.warehouse === selectedWarehouse ||
                    selectedWarehouse === ""
                )
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.warehouse}</td>
                    <td>{item.stockLevel}</td>
                    <td>{formatCurrency(item.stockValue)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>

        <section id="deliveries">
          <h2>Deliveries</h2>
          <Bar data={deliveryChartData} />
          <table className="report-table">
            <thead>
              <tr>
                <th>Delivery ID</th>
                <th>Destination</th>
                <th>Driver</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reportData.deliveries.map((delivery, index) => (
                <tr key={index}>
                  <td>{delivery.id}</td>
                  <td>{delivery.destination}</td>
                  <td>{delivery.driver}</td>
                  <td>{delivery.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="warehouse-utilization">
          <h2>Warehouse Utilization</h2>
          <Line data={warehouseUtilizationData} />
        </section>
      </main>
    </div>
  );
};

export default Reports;
