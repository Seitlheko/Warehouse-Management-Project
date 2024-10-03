import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseApp } from "../../firebase/firebase"; // Adjust the import according to your structure
import { useNavigate } from "react-router-dom";
import "./../styles/user/delivery-history.css"; // Optional: Create a CSS file for styling

const DeliveryHistory = () => {
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const db = getFirestore(firebaseApp);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveryHistory = async () => {
      try {
        const deliveryCollection = collection(db, "deliveries"); // Adjust to your collection name
        const deliverySnapshot = await getDocs(deliveryCollection);
        const historyList = deliverySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDeliveryHistory(historyList);
      } catch (error) {
        console.error("Error fetching delivery history:", error);
      }
    };

    fetchDeliveryHistory();
  }, [db]);

  return (
    <div className="delivery-history-container">
      <div className="sidebar">
        <button
          className="return-button"
          onClick={() => navigate("/user-dashboard")}
        >
          Back to User Dashboard
        </button>
        <button
          className="return-button"
          onClick={() => navigate("/deliveries")}
        >
          Back to Deliveries
        </button>
      </div>
      <div className="delivery-history-page">
        <h2 className="delivery-history-title">Delivery History</h2>
        {deliveryHistory.length === 0 ? (
          <p className="no-delivery-message">No delivery history available.</p>
        ) : (
          <div className="delivery-history-table-wrapper">
            <table className="delivery-history-table">
              <thead>
                <tr>
                  <th>Delivery ID</th>
                  <th>Source Warehouse</th>
                  <th>Destination Warehouse</th>
                  <th>Items</th>
                  <th>Delivery Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveryHistory.map((delivery) => (
                  <tr key={delivery.id}>
                    <td>{delivery.id}</td>
                    <td>{delivery.sourceWarehouse}</td>
                    <td>{delivery.destinationWarehouse}</td>
                    <td>
                      {delivery.items.map((item, index) => (
                        <div key={index}>
                          {item.name} (Quantity: {item.quantity})
                        </div>
                      ))}
                    </td>
                    <td>
                      {new Date(delivery.deliveryDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`status-label ${
                          delivery.status === "Delivered"
                            ? "status-delivered"
                            : "status-pending"
                        }`}
                      >
                        {delivery.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;
