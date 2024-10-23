import React, { useState } from 'react';

const OrderManagement = () => {
  // Dummydata
  const dummyOrders = [
    { id: 1, customerName: 'John Doe', totalAmount: 120.5, orderDate: '2024-10-01', status: 'Pending' },
    { id: 2, customerName: 'Jane Smith', totalAmount: 250.0, orderDate: '2024-10-05', status: 'Processing' },
    { id: 3, customerName: 'Michael Brown', totalAmount: 89.99, orderDate: '2024-09-28', status: 'Shipped' },
    { id: 4, customerName: 'Lucy Green', totalAmount: 350.75, orderDate: '2024-10-12', status: 'Delivered' },
    { id: 5, customerName: 'Chris Blue', totalAmount: 190.99, orderDate: '2024-10-03', status: 'Cancelled' },
    { id: 6, customerName: 'Linda White', totalAmount: 480.5, orderDate: '2024-09-25', status: 'Pending' },
    { id: 7, customerName: 'James Black', totalAmount: 70.99, orderDate: '2024-10-07', status: 'Processing' },
    { id: 8, customerName: 'Patricia Johnson', totalAmount: 660.0, orderDate: '2024-09-22', status: 'Delivered' },
    { id: 9, customerName: 'Robert King', totalAmount: 320.2, orderDate: '2024-10-10', status: 'Shipped' },
    { id: 10, customerName: 'Sophia Williams', totalAmount: 140.3, orderDate: '2024-09-30', status: 'Cancelled' },
  ];

  const [orders, setOrders] = useState(dummyOrders);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders = orders
    .filter((order) =>
      statusFilter === 'All' ? true : order.status === statusFilter
    )
    .filter((order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>

      {/* Filters and Search */}
      <div className="flex justify-between items-center mb-6">
        {/* Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <label htmlFor="statusFilter" className="font-medium">Filter by Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="w-80">
          <input
            type="text"
            placeholder="Search by customer name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Order List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-300 border-t-2">
              <th className="py-3 px-6 text-center">Order ID</th>
              <th className="py-3 px-6 text-left">Customer Name</th>
              <th className="py-3 px-6 text-center">Total Amount</th>
              <th className="py-3 px-6 text-center">Order Date</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="py-3 px-6 text-center">{order.id}</td>
                <td className="py-3 px-6 text-left">{order.customerName}</td>
                <td className="py-3 px-6 text-center">${order.totalAmount}</td>
                <td className="py-3 px-6 text-center">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-center">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    onClick={() => alert(`Details of Order ${order.id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No orders found</p>
      )}
    </div>
  );
};

export default OrderManagement;
