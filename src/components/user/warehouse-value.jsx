import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase"; // Import your Firebase setup
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions
import "../styles/user/warehouse-value.css"; // Import your CSS styles

const WarehouseValue = () => {
  const [warehouseData, setWarehouseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch warehouse data
        const warehouseSnapshot = await getDocs(collection(db, "warehouses"));
        const warehouses = warehouseSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch item data
        const itemSnapshot = await getDocs(collection(db, "items"));
        const items = itemSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Calculate warehouse values
        const updatedWarehouses = warehouses.map((warehouse) => {
          const warehouseItems = items.filter(
            (item) => item.warehouse === warehouse.name // Assuming 'name' is the field for warehouse name
          );

          const totalValue = warehouseItems.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
          );

          return {
            ...warehouse,
            value: totalValue,
            stockLevels: warehouseItems.length, // Total stock levels can be derived from items count
          };
        });

        setWarehouseData(updatedWarehouses);
      } catch (err) {
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="warehouse-value">
      <h1>Warehouse Value Overview</h1>
      <table>
        <thead>
          <tr>
            <th>Warehouse Name</th>
            <th>Value ($)</th>
            <th>Stock Levels</th>
          </tr>
        </thead>
        <tbody>
          {warehouseData.map((warehouse) => (
            <tr key={warehouse.id}>
              <td>{warehouse.name}</td>
              <td>{warehouse.value.toFixed(2)}</td>{" "}
              {/* Format to 2 decimal places */}
              <td>{warehouse.stockLevels}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WarehouseValue;
