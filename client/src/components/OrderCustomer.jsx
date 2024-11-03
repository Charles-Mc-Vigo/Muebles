import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderCustomer = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [filterStatus, setFilterStatus] = useState("All");
	const [editingOrderId, setEditingOrderId] = useState(null);
	const navigate = useNavigate();

	const fetchOrder = async () => {
		setLoading(true);
		try {
			const response = await fetch("http://localhost:3000/api/orders/my-orders", {
				method: "GET",
				credentials: "include",
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

	const handleStatusChange = async (orderId, newStatus) => {
		try {
			const response = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
				method: "PUT",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ orderStatus: newStatus }),
			});
			if (!response.ok) {
				throw new Error("Failed to update order status");
			}
			setOrders((prevOrders) =>
				prevOrders.map((order) =>
					order._id === orderId ? { ...order, orderStatus: newStatus } : order
				)
			);
			setEditingOrderId(null); // Close the edit mode after updating
		} catch (error) {
			console.error("Error updating order status", error);
		}
	};

	const filteredOrders =
		filterStatus === "All"
			? orders
			: orders.filter((order) => order.orderStatus === filterStatus.toLowerCase());

	return (
		<div className="container mx-auto p-6 bg-gray-100 min-h-screen">
			<h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Order Management</h1>
			<div className="flex justify-between mb-4">
				<div>
					<label className="text-gray-700">Filter by Status: </label>
					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
						className="border border-gray-300 rounded p-2 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="All">All</option>
						<option value="Pending">Pending</option>
						<option value="Confirmed">Confirmed</option>
						<option value="Delivered">Delivered</option>
						<option value="Cancelled">Cancelled</option>
					</select>
				</div>
				<input
					type="text"
					placeholder="Search by customer name"
					className="border border-gray-300 rounded p-2 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
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
							<th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Order ID</th>
							<th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Customer Name</th>
							<th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Total Amount</th>
							<th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Order Date</th>
							<th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Status</th>
							<th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Action</th>
						</tr>
					</thead>
					<tbody>
						{filteredOrders.map((order) => (
							<tr key={order._id} className="hover:bg-gray-100 transition-colors duration-200">
								<td className="py-3 px-4 border-b text-gray-600">{order.orderNumber}</td>
								<td className="py-3 px-4 border-b text-gray-600">{order.user.firstname}</td>
								<td className="py-3 px-4 border-b text-gray-600">PHP {order.totalAmount}</td>
								<td className="py-3 px-4 border-b text-gray-600">
									{new Date(order.createdAt).toLocaleDateString("en-US")}
								</td>
								<td className="py-3 px-4 border-b text-gray-600">
									{editingOrderId === order._id ? (
										<select
											defaultValue={order.orderStatus}
											onChange={(e) => handleStatusChange(order._id, e.target.value)}
											className="border p-1 rounded"
										>
											<option value="pending">Pending</option>
											<option value="confirmed">Confirmed</option>
											<option value="delivered">Delivered</option>
											<option value="cancelled">Cancelled</option>
										</select>
									) : (
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
									)}
								</td>
								<td className="py-3 px-4 border-b text-gray-600">
									<button
										onClick={() => setEditingOrderId(editingOrderId === order._id ? null : order._id)}
										className="text-blue-500 hover:underline"
									>
										{editingOrderId === order._id ? "Save" : "Update"}
									</button>
									<button
										onClick={() => navigate(`/orders/${order._id}`)} // Navigate to order details
										className="ml-4 text-green-500 hover:underline"
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

export default OrderCustomer;