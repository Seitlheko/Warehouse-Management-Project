import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "../styles/user/expiry-notifications.css";

// Initialize Firebase Firestore
const db = getFirestore();

const ExpiryNotifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daysThreshold, setDaysThreshold] = useState(30); // Default to items expiring within 30 days

  // Fetch items data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsSnapshot = await getDocs(collection(db, "items"));
        const fetchedItems = itemsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setItems(fetchedItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to filter items nearing expiration
  const getExpiringItems = () => {
    const currentDate = new Date();
    return items.filter((item) => {
      const expiryDate = new Date(item.expiryDate);
      const timeDiff = expiryDate - currentDate;
      const daysToExpire = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return daysToExpire <= daysThreshold && daysToExpire > 0;
    });
  };

  const expiringItems = getExpiringItems();

  if (loading) {
    return <p className="loading-message">Loading items, please wait...</p>;
  }

  return (
    <div className="expiry-notifications">
      <header className="header">
        <h1>Expiry Notifications</h1>
      </header>

      <div className="threshold-section">
        <label htmlFor="days-threshold">Days until expiry:</label>
        <input
          type="number"
          id="days-threshold"
          value={daysThreshold}
          onChange={(e) => setDaysThreshold(Number(e.target.value))}
        />
      </div>

      <section className="notifications-list">
        <h2>Items Nearing Expiry</h2>
        {expiringItems.length === 0 ? (
          <p>No items are expiring within the selected timeframe.</p>
        ) : (
          <table className="expiry-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
                <th>Warehouse</th>
                <th>Days to Expiry</th>
              </tr>
            </thead>
            <tbody>
              {expiringItems.map((item, index) => {
                const expiryDate = new Date(item.expiryDate);
                const currentDate = new Date();
                const daysToExpire = Math.ceil(
                  (expiryDate - currentDate) / (1000 * 60 * 60 * 24)
                );

                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{expiryDate.toLocaleDateString()}</td>
                    <td>{item.warehouse}</td>
                    <td>{daysToExpire} days</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default ExpiryNotifications;
