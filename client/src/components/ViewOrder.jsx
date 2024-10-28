import React, { useState, useEffect } from 'react';
import { FaBoxOpen, FaCheckCircle, FaHourglassHalf, FaClipboardCheck, FaTimesCircle } from 'react-icons/fa';

const ViewOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/orders/my-orders', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const ordersData = await response.json();
      setOrders(ordersData);
    } catch (error) {
      console.log("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">My Orders</h1>
      
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600">Loading orders...</p>
        </div>
      ) : Array.isArray(orders) && orders.length > 0 ? (
        <div className="grid gap-6">
          {orders.map((order, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaBoxOpen className="mr-2 text-blue-500" /> Order ID: {order._id}
                </h2>
                <span
                  className={`px-3 py-1 text-sm rounded-full flex items-center ${
                    order.orderStatus === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                    order.orderStatus === 'confirmed' ? 'bg-blue-200 text-blue-800' :
                    order.orderStatus === 'delivered' ? 'bg-green-200 text-green-800' :
                    order.orderStatus === 'cancelled' ? 'bg-red-200 text-red-800' : ''
                  }`}
                >
                  {order.orderStatus === 'pending' && (
                    <>
                      <FaHourglassHalf className="inline mr-1" /> Pending
                    </>
                  )}
                  {order.orderStatus === 'confirmed' && (
                    <>
                      <FaClipboardCheck className="inline mr-1" /> Confirmed
                    </>
                  )}
                  {order.orderStatus === 'delivered' && (
                    <>
                      <FaCheckCircle className="inline mr-1" /> Delivered
                    </>
                  )}
                  {order.orderStatus === 'cancelled' && (
                    <>
                      <FaTimesCircle className="inline mr-1" /> Cancelled
                    </>
                  )}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Order Items</h3>
                <div className="space-y-2">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                      <p className="font-medium text-gray-700">{item.furniture.name}</p>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-500">Price: PHP {item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <p className="text-gray-600">
                  Order placed on: {new Date(order.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-xl font-bold text-gray-800">
                  Total: PHP {order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">No orders found.</p>
      )}
    </div>
  );
};

export default ViewOrder;
