import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [filter, setFilter] = useState("all"); // Filter state

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/orders/all",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const ordersData = await response.json();
      setOrders(ordersData.orders || []);
      setFilteredOrders(ordersData.orders || []); // Initialize filtered orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/update/${orderId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleSelectChange = (orderId, event) => {
    const newStatus = event.target.value;
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
    if (selectedFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.orderStatus === selectedFilter)
      );
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Order Management
      </h1>

      <div className="flex justify-between items-center mb-4">
        <div>
          <label htmlFor="filter" className="mr-2 text-gray-700">
            Filter by Status:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            className="border rounded p-2"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {hasUnsavedChanges && (
          <button
            onClick={() => setHasUnsavedChanges(false)} // Save action can be added here
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600">Loading orders...</p>
        </div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Order ID
              </th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Customer Name
              </th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Total Amount
              </th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Order Date
              </th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <td className="py-3 px-4 border-b text-gray-600">
                  {order.orderNumber}
                </td>
                <td className="py-3 px-4 border-b text-gray-600">
                  {order.user.firstname}
                </td>
                <td className="py-3 px-4 border-b text-gray-600">
                  PHP {order.totalAmount}
                </td>
                <td className="py-3 px-4 border-b text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("en-US")}
                </td>
                <td className="py-3 px-4 border-b text-gray-600">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleSelectChange(order._id, e)}
                    className="border rounded p-1"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3 px-4 border-b text-gray-600 flex space-x-2">
                  <Link
                    to={`/order/${order._id}`}
                    className="text-green-500 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderManagement;
