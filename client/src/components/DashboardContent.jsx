import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FurnitureOrderForm from "./FurnitureOrderForm";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/orders");
        const data = await response.json();

        console.log(data);

        // Ensure that the data is an array
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("API did not return an array");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
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
        setFilteredOrders(ordersData.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const storedSection = localStorage.getItem("activeSection");
    if (storedSection) {
      setActiveSection(storedSection);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Ensure orders is an array before using reduce
  if (!Array.isArray(orders)) {
    return <div>Something went wrong with the data format.</div>;
  }

  // Calculate order stats
  const totalOrders = orders.length;

  // Calculate total revenue (excluding pending orders)
  const totalRevenue = orders.reduce((sum, order) => {
    const totalAmountWithShipping = order.totalAmountWithShipping;
    // Only include confirmed or delivered orders
    if (
      (order.orderStatus === "confirmed" ||
        order.orderStatus === "delivered") &&
      !isNaN(totalAmountWithShipping)
    ) {
      return sum + totalAmountWithShipping;
    }
    return sum;
  }, 0);

  // Calculate total paid (excluding pending orders)
  const totalPaid = orders.reduce((sum, order) => {
    const totalAmount = order.totalAmount;
    const remainingBalance = order.remainingBalance || 0;
    // Only include confirmed or delivered orders
    if (
      (order.orderStatus === "confirmed" ||
        order.orderStatus === "delivered") &&
      !isNaN(totalAmount) &&
      !isNaN(remainingBalance)
    ) {
      return sum + (totalAmount - remainingBalance);
    }
    return sum;
  }, 0);

  // Calculate outstanding balance (excluding pending orders)
  const outstandingBalance = orders.reduce((sum, order) => {
    const remainingBalance = order.remainingBalance || 0;
    // Only include confirmed or delivered orders
    if (
      (order.orderStatus === "confirmed" ||
        order.orderStatus === "delivered") &&
      !isNaN(remainingBalance)
    ) {
      return sum + remainingBalance;
    }
    return sum;
  }, 0);

  // Orders by status
  const ordersByStatus = {
    pending: orders.filter((order) => order.orderStatus === "pending").length,
    confirmed: orders.filter((order) => order.orderStatus === "confirmed")
      .length,
    delivered: orders.filter((order) => order.orderStatus === "delivered")
      .length,
    cancelled: orders.filter((order) => order.orderStatus === "cancelled")
      .length,
  };

  // Orders by payment type
  const ordersByPaymentType = {
    fullPayment: orders.filter(
      (order) => order.paymentOption === "Full Payment"
    ).length,
    partialPayment: orders.filter(
      (order) => order.paymentOption === "Partial Payment"
    ).length,
  };

  return (
    <div className="container mx-auto p-4 ">
      <div className="mb-2 flex justify-end">
        <Link
          to="/walkin"
          className="bg-green-300 rounded-lg text-xl p-3 hover:bg-green-500 inline-block"
        >
          Create New Order
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h1 className="text-xl font-bold">Total Orders</h1>
          <p className="text-2xl text-blue-600">{totalOrders}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h1 className="text-xl font-bold">Confirmed</h1>
          <p className="text-2xl text-yellow-600">{ordersByStatus.confirmed}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h1 className="text-xl font-bold">Total Revenue</h1>
          <p className="text-2xl text-black-600">₱ {totalRevenue.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg">
        <div className="flex justify-between items-center p-5">
          <h1 className="text-2xl font-semibold">Current Orders</h1>
          <button
            isActive={activeSection === "order-management"}
            onClick={() => setActiveSection("order-management")}
            className="bg-green-300 text-lg hover:bg-green-500 rounded-md px-4 py-2"
          >
            See all
          </button>
        </div>
        <table className="min-w-full bg-white border border-gray-200 shadow-md">
          <thead className="bg-green-200">
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
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <td className="py-3 px-4 border-b text-gray-600">
                  {order.orderNumber}
                </td>
                <td className="py-3 px-4 border-b text-gray-600">
                  {order.user.firstname} {order.user.lastname}
                </td>
                <td className="py-3 px-4 border-b text-gray-600">
                  PHP {order.totalAmount}
                </td>
                <td className="py-3 px-4 border-b text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("en-US")}
                </td>
                <td
                  className={`py-3 px-4 border-b text-gray-600 ${
                    order.orderStatus === "pending"
                      ? "text-yellow-500"
                      : order.orderStatus === "confirmed"
                      ? "text-blue-500"
                      : order.orderStatus === "delivered"
                      ? "text-green-500"
                      : order.orderStatus === "cancelled"
                      ? "text-red-500"
                      : order.orderStatus === "shipped"
                      ? "text-purple-500"
                      : order.orderStatus === "out for delivery"
                      ? "text-orange-500"
                      : order.orderStatus === "failed to deliver"
                      ? "text-gray-500"
                      : order.orderStatus === "returned"
                      ? "text-pink-500"
                      : ""
                  }`}
                >
                  {order.orderStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
