import React, { useState, useEffect } from "react";

const OrderManagement = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchOrder = async () => {
		setLoading(true);
		try {
			const response = await fetch("http://localhost:3000/api/admin/orders/all", {
				method: "GET",
				credentials: "include",
			});
			if (!response.ok) {
				throw new Error("Failed to fetch orders");
			}
			const ordersData = await response.json();
			setOrders(ordersData.orders || []);
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
			<h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Order Management</h1>
			{loading ? (
				<div className="flex items-center justify-center">
					<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
					<p className="ml-4 text-gray-600">Loading orders...</p>
				</div>
			) : (
				<table className="min-w-full bg-white border border-gray-200 shadow-md">
					<thead className="bg-gray-200">
						<tr>
							<th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Order ID</th>
							<th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Customer Name</th>
							<th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Total Amount</th>
							<th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Order Date</th>
							<th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Status</th>
							<th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Action</th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr key={order._id} className="hover:bg-gray-100 transition-colors duration-200">
								<td className="py-3 px-4 border-b text-gray-600">{order.orderNumber}</td>
								<td className="py-3 px-4 border-b text-gray-600">{order.user.firstname}</td>
								<td className="py-3 px-4 border-b text-gray-600">PHP {order.totalAmount}</td>
								<td className="py-3 px-4 border-b text-gray-600">
									{new Date(order.createdAt).toLocaleDateString("en-US")}
								</td>
								<td className="py-3 px-4 border-b text-gray-600">
									<span
										className={`px-3 py-1 text-sm rounded-full ${
											order.orderStatus === "pending"
												? "bg-yellow-200 text-yellow-800"
												: order.orderStatus === "confirmed"
												? "bg-blue-200 text-blue-800"
												: order.orderStatus === "delivered"
												? "bg-green-200 text-green-800"
												: "bg-red-200 text-red-800"
										}`}
									>
										{order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
									</span>
								</td>
								<td className="py-3 px-4 border-b text-gray-600">
									<button
										onClick={() => navigate(`/orders/${order._id}`)} // Navigate to order details
										className="text-green-500 hover:underline"
									>
										View
									</button>
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