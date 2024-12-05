import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const OrderManagement = () => {
	const [orders, setOrders] = useState([]);
	const [filteredOrders, setFilteredOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [filter, setFilter] = useState("all");

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
			setFilteredOrders(ordersData.orders || []);
		} catch (error) {
			console.error("Error fetching orders:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrder();
	}, []);

	const handleFilterChange = (event) => {
		const selectedFilter = event.target.value;
		setFilter(selectedFilter);

		const filtered =
			selectedFilter === "all"
				? orders.filter((order) => order.orderStatus !== "cancelled") // Exclude "cancelled" for "all"
				: orders.filter((order) => order.orderStatus === selectedFilter); // Match selected filter exactly

		console.log("Selected Filter:", selectedFilter);
		console.log("Filtered Orders:", filtered);

		setFilteredOrders(filtered);
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
						<option value="shipped">Shipped</option>
						<option value="out for delivery">Out for Delivery</option>
						<option value="failed to deliver">Failed to Deliver</option>
						<option value="returned">Returned</option>
					</select>
				</div>
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
								Payment Type
							</th>
							<th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">
								Total Payment / Remaining Balance
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
									{order.orderStatus === "pending" && "Pending"}
									{order.orderStatus === "confirmed" && "Confirmed"}
									{order.orderStatus === "delivered" && "Delivered"}
									{order.orderStatus === "cancelled" && "Cancelled"}
									{order.orderStatus === "shipped" && "Shipped"}
									{order.orderStatus === "out for delivery" &&
										"Out for Delivery"}
									{order.orderStatus === "failed to deliver" &&
										"Failed to Deliver"}
									{order.orderStatus === "returned" && "Returned"}
								</td>

								{/* Payment Type */}
								<td className="py-3 px-4 border-b text-gray-600">
									{order.paymentOption === "Full Payment"
										? "Full Payment"
										: "Partial Payment"}
								</td>

								{/* Payment Info: Total Payment and Remaining Balance */}
								<td className="py-3 px-4 border-b text-gray-600">
									{order.paymentOption === "Full Payment"
										? `₱ ${order.totalAmountWithShipping}`
										: `₱ ${
												order.totalAmountWithShipping - order.remainingBalance
										  } / ₱ ${order.remainingBalance}`}
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
