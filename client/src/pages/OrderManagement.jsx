import React, { useEffect, useState } from 'react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/admin/orders/all',{
          method:"GET",
          credentials:'include'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data); // Check the structure of the response
        setOrders(data.orders || data); // Adjust according to the actual structure
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Order Management</h1>
      <table>
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Customer Name</th>
            <th>Order Date</th>
            <th>Order Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}> {/* Assuming each order has a unique 'id' */}
                <td>{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td> {/* Format date */}
                <td>{order.orderStatus}</td>
                <td>
                  <button onClick={() => handleAction(order.id)}>Action</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Example action handler function
const handleAction = (orderId) => {
  console.log(`Action clicked for order ID: ${orderId}`);
  // Implement your action logic here
};

export default OrderManagement;