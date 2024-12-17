import React, { useState, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
	FaBoxOpen,
	FaCheckCircle,
	FaHourglassHalf,
	FaClipboardCheck,
	FaTimesCircle,
	FaShippingFast,
	FaRoute,
} from "react-icons/fa";
import { MdWrongLocation } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const ViewOrder = () => {
	const [orders, setOrders] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [furniture, setFurniture] = useState(null);
	const [loading, setLoading] = useState(false);
	const [cancelLoading, setCancelLoading] = useState(null);
	const [filter, setFilter] = useState("All"); // State for filter
	const [selectedImage, setSelectedImage] = useState(null);

	const navigate = useNavigate();

	const fetchOrder = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				"http://localhost:3000/api/orders/my-orders",
				{
					method: "GET",
					credentials: "include",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to fetch orders");
			}
			const ordersData = await response.json();
			setOrders(ordersData);
			// const furnitureIds = orders.map((order) => order.furniture._id);
			// console.log(furnitureIds);
			console.log(ordersData);
		} catch (error) {
			console.log("Error fetching orders", error);
			setErrorMessage(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrder();
	}, []);

	const cancelOrder = async (orderId) => {
		setCancelLoading(orderId);
		try {
			const response = await fetch(
				`http://localhost:3000/api/orders/cancel/${orderId}`,
				{
					method: "PUT",
					credentials: "include",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to cancel order");
			}
			alert("Order was cancelled");
			fetchOrder();
		} catch (error) {
			console.log(error);
			setErrorMessage(error.message);
		} finally {
			setCancelLoading(null);
		}
	};
	const handleDeliveryConfirmation = async (orderId) => {
		setLoading(true);
		try {
			const response = await fetch(
				`http://localhost:3000/api/orders/confirm-delivery/${orderId}`,
				{
					method: "POST",
					credentials: "include",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to confirm order");
			}
			alert("Order has been confirmed!");
			fetchOrder();
		} catch (error) {
			console.log(error);
			setErrorMessage(error.message);
		} finally {
			setLoading(false);
		}
	};

	// Filter orders based on the selected filter
	const filteredOrders = orders.filter((order) => {
		if (filter === "All") return order.orderStatus !== "cancelled"; // Exclude cancelled orders
		return order.orderStatus === filter.toLowerCase();
	});

	return (
		<div className="bg-gray-50 w-full min-h-screen">
			<Header isLogin={true} />
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				<div className="flex items-center mb-6">
					<button
						onClick={() => navigate(-1)}
						className="text-gray-600 hover:text-gray-800 transition-colors"
					>
						<IoMdArrowRoundBack size={30} />
					</button>
					<h1 className="text-3xl font-bold text-gray-800 ml-4">My Orders</h1>
				</div>

				{/* Filter Buttons */}
				<div className="mb-4">
					<div className="flex space-x-4">
						{[
							"All",
							"Pending",
							"Confirmed",
							"Delivered",
							"Cancelled",
							"Out for Delivery",
							"Failed to Delivery",
							"Repaired",
						].map((status) => (
							<button
								key={status}
								onClick={() => setFilter(status)}
								className={`px-4 py-2 rounded-lg transition-colors 
                  ${
										filter === status
											? "bg-blue-500 text-white"
											: "bg-gray-200 text-gray-800 hover:bg-blue-100"
									}`}
							>
								{status}
							</button>
						))}
					</div>
				</div>

				{loading ? (
					<div className="flex items-center justify-center p-8">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
						<p className="ml-4 text-gray-600">Loading orders...</p>
					</div>
				) : errorMessage ? (
					<div className="bg-red-50 text-red-600 p-4 rounded-lg">
						<p>Error: {errorMessage}</p>
					</div>
				) : filteredOrders.length > 0 ? (
					<div className="space-y-6">
						{filteredOrders.map((order, index) => (
							<div
								key={index}
								className="bg-white shadow-lg rounded-lg overflow-hidden"
							>
								{/* Order Header */}
								<div className="bg-gray-50 p-4 border-b">
									<div className="flex justify-between items-center flex-wrap gap-4">
										<h2 className="text-lg font-semibold text-gray-800 flex items-center">
											<FaBoxOpen className="mr-2 text-blue-500" />
											Order ID: {order.orderNumber}
										</h2>
										{/* <p className="px-5 py-2 bg-slate-100 rounded-md">
											{order.repairRequest?.requested === true && "Request was"}
											{order.repairRequest?.requested === true && "Requested"}
										</p> */}
										<span
											className={`px-4 py-2 rounded-full text-sm font-medium flex items-center
    ${
			order.orderStatus === "pending"
				? "bg-yellow-100 text-yellow-800"
				: order.orderStatus === "confirmed"
				? "bg-blue-100 text-blue-800"
				: order.orderStatus === "delivered"
				? "bg-green-100 text-green-800"
				: order.orderStatus === "cancelled"
				? "bg-red-100 text-red-800"
				: order.orderStatus === "out for delivery"
				? "bg-orange-100 text-orange-800"
				: order.orderStatus === "failed to deliver"
				? "bg-gray-100 text-gray-800"
				: order.orderStatus === "repaired"
				? "bg-pink-100 text-pink-800"
				: ""
		}`}
										>
											{order.orderStatus === "pending" && (
												<>
													<FaHourglassHalf className="mr-2" /> Pending
												</>
											)}
											{order.orderStatus === "confirmed" && (
												<>
													<FaClipboardCheck className="mr-2" /> Confirmed
												</>
											)}
											{order.orderStatus === "delivered" && (
												<>
													<FaCheckCircle className="mr-2" /> Delivered
												</>
											)}
											{order.orderStatus === "cancelled" && (
												<>
													<FaTimesCircle className="mr-2" /> Cancelled
												</>
											)}
											{order.orderStatus === "out for delivery" && (
												<>
													<FaShippingFast className="mr-2" /> Out for Delivery
												</>
											)}
											{order.orderStatus === "failed to deliver" && (
												<>
													<MdWrongLocation className="mr-2" /> Delivery Attempt
													Failed
												</>
											)}
											{order.orderStatus === "repaired" && (
												<>
													<FaBoxOpen className="mr-2" /> Repaired
												</>
											)}
										</span>
									</div>
								</div>
								<div className="p-6">
									{order.type === "Pre-Order" ? (
										<div>
											<div className="bg-gray-50 rounded-lg p-4 mb-4">
												<h3 className="font-medium text-gray-700 mb-4"></h3>
												<p>Payment: {order.paymentOption}</p>
												<div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
													<div className="flex items-center space-x-4">
														<div className="bg-gray-50 p-2 rounded w-24 h-24 flex items-center justify-center">
															{order.furniture.images &&
																order.furniture.images.length > 0 && (
																	<img
																		src={`data:image/jpeg;base64,${order.furniture.images[0]}`}
																		alt={order.furniture.name}
																		className="max-w-full max-h-full object-contain"
																	/>
																)}
														</div>
														<div className="flex-grow">
															<p className="font-medium text-gray-800">
																{order.furniture.name}
															</p>
															<div className="mt-2 space-y-1">
																<p className="text-sm text-gray-600">
																	Quantity: {order.quantity}
																</p>
																<p className="text-sm text-gray-600">
																	Price: PHP {order.totalAmount}
																</p>
																{order.expectedDelivery && (
																	<p className="text-sm text-gray-600">
																		Expected Delivery:{" "}
																		{order.expectedDelivery.startDate &&
																			new Date(
																				order.expectedDelivery.startDate
																			).toLocaleDateString("en-US", {
																				year: "numeric",
																				month: "long",
																				day: "numeric",
																			})}{" "}
																		-{" "}
																		{order.expectedDelivery.endDate &&
																			new Date(
																				order.expectedDelivery.endDate
																			).toLocaleDateString("en-US", {
																				year: "numeric",
																				month: "long",
																				day: "numeric",
																			})}
																	</p>
																)}
																<p className="text-sm text-gray-600">
																	Delivery Mode: {order.deliveryMode}
																</p>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className="space-y-3">
												<p className="text-gray-600">
													Order placed on:{" "}
													{new Date(order.createdAt).toLocaleDateString(
														"en-US",
														{
															year: "numeric",
															month: "long",
															day: "numeric",
														}
													)}
												</p>
												<p className="text-gray-600">
													Shipping Fee: PHP {order.shippingFee}
												</p>
												{order.paymentOption === "Partial Payment" && (
													<p className="text-gray-600">
														Remaining Balance: PHP {order.remainingBalance}
													</p>
												)}
												<p className="text-xl font-bold text-gray-800">
													Total: PHP {order.totalAmountWithShipping}
												</p>
											</div>
										</div>
									) : order.type === "Cart" ? (
										<div>
											<div className=" rounded-lg p-4 mb-4">
												<h3 className="font-medium text-gray-700 mb-4">
													{order.orderStatus === "pending" && (
														<div className="p-5 text-right bg-yellow-200">
															<h1>Your order is being processed</h1>
														</div>
													)}
													{order.orderStatus === "confirmed" && (
														<div className="p-5 text-right bg-blue-200">
															<h1>Your order is being processed</h1>
														</div>
													)}
													{order.orderStatus === "out for delivery" && (
														<div className="p-5 text-right bg-orange-200">
															<h1>Your order is out for delivery</h1>
														</div>
													)}
													{order.orderStatus === "delivered" && (
														<div className="p-5 text-right bg-green-200">
															<h1>Your order has been delivered</h1>
														</div>
													)}
													{order.orderStatus === "failed to deliver" && (
														<div className="p-5 text-right bg-gray-200">
															<h1>Delivery attempt failed</h1>
														</div>
													)}
													{order.orderStatus === "repaired" && (
														<div className="p-5 text-right bg-pink-200">
															<h1>Your order has been repaired</h1>
														</div>
													)}
													{order.orderStatus === "cancelled" && (
														<div className="p-5 text-right bg-red-200">
															<h1>Order cancelled</h1>
														</div>
													)}
												</h3>
												<p>Payment: {order.paymentOption}</p>
												<div className="space-y-4">
													{order.items.map((item, itemIndex) => (
														<div
															key={itemIndex}
															className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
														>
															<div className="flex items-center space-x-4">
																<div className="bg-gray-50 p-2 rounded w-24 h-24 flex items-center justify-center">
																	{item.furniture.images.length > 0 && (
																		<img
																			src={`data:image/jpeg;base64,${item.furniture.images[0]}`}
																			alt={item.furniture.name}
																			className="max-w-full max-h-full object-contain"
																		/>
																	)}
																</div>
																<div className="flex-grow">
																	<p className="font-medium text-gray-800">
																		{item.furniture.name}
																	</p>
																	<div className="mt-2 space-y-1">
																		<p className="text-sm text-gray-600">
																			Quantity: {item.quantity}
																		</p>
																		<p className="text-sm text-gray-600">
																			Price: PHP {order.totalAmount}
																		</p>
																		<p className="text-sm text-gray-600">
																			Expected Delivery:{" "}
																			{order.expectedDelivery}
																		</p>
																		<p className="text-sm text-gray-600">
																			Delivery Mode: {order.deliveryMode}
																		</p>
																	</div>
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
											<div className="space-y-3">
												<p className="text-gray-600">
													Order placed on:{" "}
													{new Date(order.createdAt).toLocaleDateString(
														"en-US",
														{
															year: "numeric",
															month: "long",
															day: "numeric",
														}
													)}
												</p>
												<p className="text-gray-600">
													Shipping Fee: PHP {order.shippingFee}
												</p>
												{order.paymentOption === "Partial Payment" && (
													<p className="text-gray-600">
														Remaining Balance: PHP {order.remainingBalance}
													</p>
												)}
												<p className="text-xl font-bold text-gray-800">
													Total: PHP {order.totalAmountWithShipping}
												</p>
											</div>
										</div>
									) : (
										<>
											<div>
												<div className=" rounded-lg p-4 mb-4">
													<h3 className="font-medium text-gray-700 mb-4">
														<h1>{order.type === "ImageUpload" && "Type: From Image Upload"}</h1>
														{order.orderStatus === "pending" && (
															<div className="p-5 text-right bg-yellow-200">
																<h1>Your order is being processed</h1>
															</div>
														)}
														{order.orderStatus === "confirmed" && (
															<div className="p-5 text-right bg-blue-200">
																<h1>Your order is being processed</h1>
															</div>
														)}
														{order.orderStatus === "out for delivery" && (
															<div className="p-5 text-right bg-orange-200">
																<h1>Your order is out for delivery</h1>
															</div>
														)}
														{order.orderStatus === "delivered" && (
															<div className="p-5 text-right bg-green-200">
																<h1>Your order has been delivered</h1>
															</div>
														)}
														{order.orderStatus === "failed to deliver" && (
															<div className="p-5 text-right bg-gray-200">
																<h1>Delivery attempt failed</h1>
															</div>
														)}
														{order.orderStatus === "repaired" && (
															<div className="p-5 text-right bg-pink-200">
																<h1>Your order has been repaired</h1>
															</div>
														)}
														{order.orderStatus === "cancelled" && (
															<div className="p-5 text-right bg-red-200">
																<h1>Order cancelled</h1>
															</div>
														)}
													</h3>
													<p>Payment: {order.paymentOption || "Not set"}</p>
													<div className="space-y-4">
														<div className="flex items-center space-x-4">
															{order.designImages?.map((image, imgIndex) => (
																<img
																	key={imgIndex}
																	src={`data:image/jpeg;base64,${image}`}
																	className="w-20 h-20 object-cover rounded-lg"
																	alt={`Order Image ${imgIndex}`}
																	onClick={() => setSelectedImage(image)}
																/>
															))}
															{selectedImage && (
																<div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
																	<div className="relative">
																		<img
																			src={`data:image/jpeg;base64,${selectedImage}`}
																			className="w-[80vw] h-[80vh] object-contain rounded-lg border-4 border-white shadow-2xl"
																			alt="Selected Design"
																		/>
																		<button
																			className="absolute top-4 right-4 text-white text-3xl font-bold"
																			onClick={() => setSelectedImage(null)}
																		>
																			&times;
																		</button>
																	</div>
																</div>
															)}

															<div className="flex-grow">
																<div className="mt-2 space-y-1">
																	<p className="text-sm text-gray-600">
																		Quantity: {order.quantity || "Not set"}
																	</p>
																	<p className="text-sm text-gray-600">
																		Price: PHP {order.totalAmount || "Not set"}
																	</p>
																	<p className="text-sm text-gray-600">
																		Expected Delivery:{" "}
																		{order.expectedDelivery || "Not set"}
																	</p>
																	<p className="text-sm text-gray-600">
																		Delivery Mode:{" "}
																		{order.deliveryMode || "Not set"}
																	</p>
																</div>
															</div>
														</div>
													</div>
												</div>
												<div className="space-y-3">
													<p className="text-gray-600">
														Order placed on:{" "}
														{new Date(order.createdAt).toLocaleDateString(
															"en-US",
															{
																year: "numeric",
																month: "long",
																day: "numeric",
															}
														)}
													</p>
													<p className="text-gray-600">
														Shipping Fee: PHP {order.shippingFee || "Not set"}
													</p>
													{order.paymentOption === "Partial Payment" && (
														<p className="text-gray-600">
															Remaining Balance: PHP {order.remainingBalance || "Not set"}
														</p>
													)}
													<p className="text-xl font-bold text-gray-800 text-right">
														Total: PHP {order.totalAmount || "Not set"}
													</p>
												</div>
											</div>
										</>
									)}
									{/* Cancel Order Button or Confirm Delivery Button */}
									<div className="flex justify-end mt-6">
										{order.orderStatus === "delivered" && !order.isDelivered ? (
											<button
												onClick={() => handleDeliveryConfirmation(order._id)}
												className="px-6 py-2 rounded-lg bg-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white"
											>
												Confirm Delivery
											</button>
										) : (
											<div className="flex gap-5">
												{order.orderStatus === "delivered" &&
												order.isDelivered ? (
													<>
														<button
															onClick={() =>
																navigate(`/request-for-repair/${order._id}`)
															}
															className="px-16 py-2 rounded-lg bg-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white"
														>
															{order.repairRequest?.requested === true
																? "Requested"
																: "Repair"}
														</button>
														<button
															onClick={() => navigate(`/rating/${order._id}`)}
															className="px-16 py-2 rounded-lg bg-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white"
														>
															Rate
														</button>
													</>
												) : (
													<div>
														{order.isDelivered && (
															<p className="text-green-600">
																Delivery confirmed
															</p>
														)}
													</div>
												)}
											</div>
										)}

										{order.orderStatus === "pending" && (
											<button
												disabled={
													order.orderStatus !== "pending" ||
													cancelLoading === order._id
												}
												onClick={() => cancelOrder(order._id)}
												className={`px-6 py-2 rounded-lg transition-colors
        ${
					order.orderStatus !== "pending"
						? "bg-gray-100 text-gray-400 cursor-not-allowed"
						: cancelLoading === order._id
						? "bg-red-100 text-red-400 cursor-not-allowed"
						: "bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white"
				}`}
											>
												{cancelLoading === order._id
													? "Cancelling..."
													: "Cancel Order"}
											</button>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-12 bg-white rounded-lg shadow">
						<FaBoxOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
						<p className="text-gray-500 text-lg">No orders found.</p>
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
};

export default ViewOrder;
