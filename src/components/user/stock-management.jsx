import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FaSearch, FaPlus, FaWarehouse, FaBox } from "react-icons/fa";
import "./../styles/user/stock-management.css";

const StockManagement = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemUnit, setItemUnit] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [warehouseValue, setWarehouseValue] = useState(0);

  // Fetch warehouse names from Firebase
  useEffect(() => {
    const fetchWarehouses = async () => {
      const querySnapshot = await getDocs(collection(db, "warehouses"));
      const warehouseList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWarehouses(warehouseList);
    };

    fetchWarehouses();
  }, []);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, "items"));
    const itemsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAllItems(itemsList);
  };

  const handleAddItem = async () => {
    if (
      !selectedWarehouse ||
      !itemName ||
      !itemQuantity ||
      !itemUnit ||
      !itemPrice ||
      !expiryDate
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "items"), {
        warehouse: selectedWarehouse,
        name: itemName,
        quantity: itemQuantity,
        unit: itemUnit,
        price: itemPrice,
        expiryDate,
      });
      fetchItems();
      resetForm();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const resetForm = () => {
    setItemName("");
    setItemQuantity("");
    setItemUnit("");
    setItemPrice("");
    setExpiryDate("");
  };

  // Filter items by warehouse and search term
  const filteredItems = allItems
    .filter((item) =>
      selectedWarehouse ? item.warehouse === selectedWarehouse : false
    )
    .filter((item) =>
      searchTerm
        ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  // Calculate warehouse value in USD
  useEffect(() => {
    if (selectedWarehouse) {
      const totalValue = filteredItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      setWarehouseValue(totalValue);
    }
  }, [selectedWarehouse, filteredItems]);

  // Chart Data
  const chartData = warehouses.map((warehouse) => {
    const totalQuantity = allItems
      .filter((item) => item.warehouse === warehouse.Name) // Assuming 'Name' is the field for warehouse name
      .reduce((sum, item) => sum + Number(item.quantity), 0);
    return { name: warehouse.Name, quantity: totalQuantity }; // Assuming 'Name' is the field for warehouse name
  });

  // Custom Tooltip for the Bar Chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Warehouse: ${payload[0].payload.name}`}</p>
          <p className="intro">{`Total Quantity: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Color gradient for bars
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8b0000"];

  return (
    <div className="stock-management">
      <div className="header">
        <h2 className="header-title" style={{ color: "white" }}>
          Stock Management
        </h2>
      </div>

      <div className="main-content">
        {/* Sidebar and Graph Section */}
        <div className="sidebar-graph">
          <div className="bar-chart">
            <h3>Stock Levels by Warehouse</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="quantity" fill="#8884d8" animationDuration={1500}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="warehouse-selection">
            <label>
              <FaWarehouse /> Select Warehouse:
            </label>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="input-field"
            >
              <option value="">-- Select a Warehouse --</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.Name}>
                  {warehouse.Name}
                </option>
              ))}
            </select>

            {selectedWarehouse && (
              <div className="warehouse-value">
                <h3>
                  Total Value of {selectedWarehouse}: $
                  {warehouseValue.toFixed(2)}
                </h3>
              </div>
            )}

            <div className="search-bar">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
              <FaSearch className="search-icon" />
            </div>
          </div>
        </div>

        {/* Item Management Section */}
        <div className="item-management">
          <h3>
            <FaPlus /> Add New Item
          </h3>
          <div className="input-group">
            <input
              type="text"
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              className="input-field"
            />
            <select
              value={itemUnit}
              onChange={(e) => setItemUnit(e.target.value)}
              className="input-field"
            >
              <option value="">Unit</option>
              <option value="kg">kg</option>
              <option value="liters">liters</option>
              <option value="packs">packs</option>
            </select>
            <input
              type="number"
              placeholder="Price in USD"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              className="input-field"
            />
            <input
              type="date"
              placeholder="Expiry Date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="input-field"
            />
            <button onClick={handleAddItem} className="add-button">
              <FaPlus /> Add Item
            </button>
          </div>

          {selectedWarehouse && (
            <div className="all-items">
              <h3>
                <FaBox /> Items in {selectedWarehouse}
              </h3>
              <ul className="all-items-list">
                {filteredItems.map((item) => (
                  <li key={item.id} className="item-list">
                    <span>
                      {item.name} - {item.quantity} {item.unit} - ${item.price}{" "}
                      - Expiry: {new Date(item.expiryDate).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
