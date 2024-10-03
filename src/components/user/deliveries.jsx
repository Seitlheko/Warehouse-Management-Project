import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { firebaseApp } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import "./../styles/user/deliveries.css";

const DeliveriesPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [sourceWarehouse, setSourceWarehouse] = useState("");
  const [destinationWarehouse, setDestinationWarehouse] = useState("");
  const [itemsToDispatch, setItemsToDispatch] = useState([]);
  const [sourceAvailableItems, setSourceAvailableItems] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  // Initialize Firestore
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const warehouseCollection = collection(db, "warehouses");
        const warehouseSnapshot = await getDocs(warehouseCollection);
        const warehouseList = warehouseSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWarehouses(warehouseList);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    };

    fetchWarehouses();
  }, [db]);

  useEffect(() => {
    const fetchAvailableItems = async () => {
      if (sourceWarehouse) {
        const itemsCollection = collection(db, "items");
        const itemsSnapshot = await getDocs(itemsCollection);
        const availableItems = itemsSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => item.warehouse === sourceWarehouse);

        setSourceAvailableItems(availableItems);
      }
    };

    fetchAvailableItems();
  }, [sourceWarehouse, db]);

  const handleAddItem = (item, quantity) => {
    if (quantity > item.quantity) {
      alert("You cannot dispatch more than the available quantity.");
      return;
    }

    const existingItem = itemsToDispatch.find((i) => i.id === item.id);
    if (existingItem) {
      setItemsToDispatch(
        itemsToDispatch.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      );
    } else {
      setItemsToDispatch([...itemsToDispatch, { ...item, quantity }]);
    }
  };

  const handleDeleteItem = (itemId) => {
    setItemsToDispatch(itemsToDispatch.filter((item) => item.id !== itemId));
  };

  const handleAddDelivery = async () => {
    try {
      const deliveryData = {
        sourceWarehouse,
        destinationWarehouse,
        items: itemsToDispatch,
        deliveryDate: new Date(deliveryDate),
        status: "Pending",
      };

      const deliveriesCollection = collection(db, "deliveries");
      await addDoc(deliveriesCollection, deliveryData);

      setItemsToDispatch([]);
      setSourceWarehouse("");
      setDestinationWarehouse("");
      setDeliveryDate(new Date().toISOString().slice(0, 10));
      alert("Delivery added successfully!");
    } catch (error) {
      console.error("Error adding delivery:", error);
    }
  };

  return (
    <div className="deliveries-page">
      <div className="sidebar" style={{ backgroundColor: "orange" }}>
        <h2>Deliveries</h2>
        <ul>
          <li>
            <Link to="/user-dashboard" className="sidebar-button">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/delivery-history" className="sidebar-button">
              Delivery History
            </Link>
          </li>
          {/* Add more links as necessary */}
        </ul>
      </div>

      <div className="main-content">
        <h2>Manage Deliveries</h2>
        <div className="warehouse-selection">
          <label htmlFor="source-warehouse">Source Warehouse:</label>
          <select
            id="source-warehouse"
            value={sourceWarehouse}
            onChange={(e) => setSourceWarehouse(e.target.value)}
            className="dropdown-small"
          >
            <option value="">-- Select Source Warehouse --</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.Name}>
                {warehouse.Name}
              </option>
            ))}
          </select>

          <label htmlFor="destination-warehouse">Destination Warehouse:</label>
          <select
            id="destination-warehouse"
            value={destinationWarehouse}
            onChange={(e) => setDestinationWarehouse(e.target.value)}
            className="dropdown-small"
          >
            <option value="">-- Select Destination Warehouse --</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.Name}>
                {warehouse.Name}
              </option>
            ))}
          </select>
        </div>

        <div className="item-selection">
          <h3>Select Items to Dispatch:</h3>
          <ul>
            {sourceAvailableItems.map((item) => (
              <li key={item.id}>
                {item.name} (Available: {item.quantity} {item.unit})
                <input
                  type="number"
                  min="1"
                  max={item.quantity}
                  defaultValue="1"
                  onChange={(e) =>
                    handleAddItem(item, parseInt(e.target.value))
                  }
                />
                <button onClick={() => handleAddItem(item, 1)}>Add</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="items-dispatched">
          <h3>Items to Dispatch:</h3>
          <ul>
            {itemsToDispatch.map((item, index) => (
              <li key={index}>
                {item.name} (Quantity: {item.quantity})
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="delivery-info">
          <label htmlFor="delivery-date">Delivery Date:</label>
          <input
            type="date"
            id="delivery-date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>

        <button
          className="add-delivery"
          onClick={handleAddDelivery}
          disabled={itemsToDispatch.length === 0}
        >
          Add Delivery
        </button>
      </div>
    </div>
  );
};

export default DeliveriesPage;
