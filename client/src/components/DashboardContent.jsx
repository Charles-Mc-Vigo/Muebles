import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/orders');
        const data = await response.json();

        console.log(data);

        // Ensure that the data is an array
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error('API did not return an array');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      (order.orderStatus === 'confirmed' || order.orderStatus === 'delivered') && 
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
      (order.orderStatus === 'confirmed' || order.orderStatus === 'delivered') &&
      !isNaN(totalAmount) && !isNaN(remainingBalance)
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
      (order.orderStatus === 'confirmed' || order.orderStatus === 'delivered') &&
      !isNaN(remainingBalance)
    ) {
      return sum + remainingBalance;
    }
    return sum;
  }, 0);

  // Orders by status
  const ordersByStatus = {
    pending: orders.filter(order => order.orderStatus === 'pending').length,
    confirmed: orders.filter(order => order.orderStatus === 'confirmed').length,
    delivered: orders.filter(order => order.orderStatus === 'delivered').length,
    cancelled: orders.filter(order => order.orderStatus === 'cancelled').length,
  };

  // Orders by payment type
  const ordersByPaymentType = {
    fullPayment: orders.filter(order => order.paymentOption === 'Full Payment').length,
    partialPayment: orders.filter(order => order.paymentOption === 'Partial Payment').length,
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h1 className="text-xl font-bold">Total Orders</h1>
          <p className="text-2xl text-blue-600">{totalOrders}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h1 className="text-xl font-bold">Total Revenue</h1>
          <p className="text-2xl text-black-600">₱ {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h1 className="text-xl font-bold">Outstanding Balance</h1>
          <p className="text-2xl text-red-600">₱ {outstandingBalance.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h1 className="text-xl font-bold">Pending</h1>
          <p className="text-2xl text-blue-600">{ordersByStatus.pending}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h1 className="text-xl font-bold">Confirmed</h1>
          <p className="text-2xl text-yellow-600">{ordersByStatus.confirmed}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h1 className="text-xl font-bold">Delivered</h1>
          <p className="text-2xl text-black-600">{ordersByStatus.delivered}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h1 className="text-xl font-bold">Cancelled</h1>
          <p className="text-2xl text-red-600">{ordersByStatus.cancelled}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h1 className="text-xl font-bold">Full Payment Orders</h1>
          <p className="text-2xl text-black-600">{ordersByPaymentType.fullPayment}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h1 className="text-xl font-bold">Partial Payment Orders</h1>
          <p className="text-2xl text-yellow-600">{ordersByPaymentType.partialPayment}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
