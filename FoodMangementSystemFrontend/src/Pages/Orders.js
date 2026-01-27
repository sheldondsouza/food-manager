import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import '../Pages/Order.css';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([
    { id: "01", orderType: "Dine In", tableNumber: "05", status: "Ongoing: 4 Min", items: ['Double Cheeseburger', 'Apple Pie', 'Coca-Cola L'], time: "9:37 AM" },
    { id: "02", orderType: "Done", tableNumber: "05", status: "Served", items: ['Double Cheeseburger', 'Apple Pie', 'Coca-Cola L'], time: "9:37 AM" },
    { id: "03", orderType: "Take Away", tableNumber: "05", status: "Not Picked up", items: ['Double Cheeseburger', 'Apple Pie', 'Coca-Cola L'], time: "9:37 AM" },
    { id: "04", orderType: "Dine In", tableNumber: "05", status: "Ongoing: 4 Min", items: ['Double Cheeseburger', 'Apple Pie', 'Coca-Cola L'], time: "9:37 AM" },
    { id: "05", orderType: "Done", tableNumber: "05", status: "Served", items: ['Double Cheeseburger', 'Apple Pie', 'Coca-Cola L'], time: "9:37 AM" },
    { id: "06", orderType: "Take Away", tableNumber: "05", status: "Not Picked up", items: ['Double Cheeseburger', 'Apple Pie', 'Coca-Cola L'], time: "9:37 AM" },
    { id: "07", orderType: "Dine In", tableNumber: "05", status: "Ongoing: 4 Min", items: ['Double Cheeseburger', 'Apple Pie', 'Coca-Cola L'], time: "9:37 AM" },
    { id: "08", orderType: "Done", tableNumber: "05", status: "Served", items: ['Double Cheeseburger', 'Apple Pie', 'Coca-Cola L'], time: "9:37 AM" },
    { id: "09", orderType: "Take Away", tableNumber: "05", status: "Not Picked up", items: ['Double Cheeseburger', 'Apple Pie', 'Coca-Cola L'], time: "9:37 AM" },
    { id: "10", orderType: "Dine In", tableNumber: "05", status: "Ongoing: 4 Min", items: ['Double Cheeseburger', 'Apple Pie', 'Coca-Cola L'], time: "9:37 AM" },
    { id: "11", orderType: "Done", tableNumber: "05", status: "Served", items: ['Double Cheeseburger', 'Apple Pie', 'Coca-Cola L'], time: "9:37 AM" },
    { id: "12", orderType: "Take Away", tableNumber: "05", status: "Not Picked up", items: ['Double Cheeseburger', 'Apple Pie', 'Coca-Cola L'], time: "9:37 AM" },
    { id: "13", orderType: "Dine In", tableNumber: "05", status: "Ongoing: 4 Min", items: ['Double Cheeseburger', 'Apple Pie', 'Coca-Cola L'], time: "9:37 AM" },

  ]);
  //The above one is a mock data for orders, We can remove it after fetching from backend


  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5001/admin/orders/getAllOrders');
      console.log("Fetched orders:", response.data);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  const updateOrderIfTakeAway = async (orderId, newStatus) => {
    const typeOfOrder = orders.find(order => order._id === orderId).orderType;
    if (typeOfOrder === "Take Away") {
      try {
        const response = await axios.put(`http://localhost:5001/admin/orders/updateOrderStatusIfTake-Away/${orderId}`, { status: newStatus });
        console.log("Order updated successfully:", response.data);
        fetchOrders();
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  }
  const handleStatusChange = (id, newStatus) => {
    updateOrderIfTakeAway(id, newStatus);
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };
  //{`order-card ${order.orderType.replace(" ", "-").toLowerCase()}`||`order-card${order.status.replace(" ", "-").toLowerCase().includes('Take Away')}`}
  return (
    <div>
      <Sidebar />
      <div className="orders-container">
        <h1>Order Line</h1>
        <div className="orders-grid">
          {orders.map((order, index) => (

            <div
              key={index}
              className={`order-card ${order.orderType === "Take Away"
                ? "take-away"
                : order.orderType === "Dine In" && order.status.includes("Ongoing")
                  ? "dine-in"
                  : order.status === "Served"
                    ? "done"
                    : ""
                }`}

            >
              <div className="order-header">
                <span>🍴 # {order.id}</span>
                <div className="order-type">
                  <p>{order.orderType}</p>
                  {order.orderType === "Take Away" && order.status === "Not Picked up" ? (
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option>Not Picked up</option>
                      <option>Picked Up</option>
                    </select>
                  ) : (
                    <p>{order.status}</p>
                  )}
                </div>
              </div>
              <div className="order-details">
                <p>Table - {order.tableNumber}</p>
                <p>{order.time}</p>
                <p><strong>{order.items.length} Item</strong></p>
                <ul>
                  {order.items.map((item, i) => <li key={i}>1 × {item}</li>)}
                </ul>
              </div>
              <div className="order-footer">
                {order.orderType === "Dine In" && (order.status === "Processing" || order.status.includes('Ongoing')) ? (
                  <button className="processing-btn">⌛ Processing</button>
                ) : order.status === "Done" || order.status === "Served" ? (
                  <button className="done-btn">✅ Order Done</button>
                ) : (
                  <button className="takeaway-btn">📦 Order Done</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
