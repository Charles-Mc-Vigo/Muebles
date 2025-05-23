import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewUserOrder = () => {
	const { orderId } = useParams();
	const [order, setOrder] = useState(null);
	const [furnitureType, setFurnitureType] = useState(null);
	const [materials, setMaterials] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newStatus, setNewStatus] = useState(""); // State for new status
	const [selectedImage, setSelectedImage] = useState(null);
	const [price, setPrice] = useState(null);

	const navigate = useNavigate();

	const fetchOrder = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`http://localhost:3000/api/admin/order/${orderId}`,
				{
					method: "GET",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (!response.ok) {
				const errorData = await response.json();
				toast.error(errorData.error || "Failed to fetch order details.");
				return;
			}
			const existingOrder = await response.json();
			setOrder(existingOrder);
			setNewStatus(existingOrder.orderStatus); // Set the initial status
			console.log(existingOrder);

			// Fetch furniture type after fetching the order
			const furnitureTypeId = existingOrder.furniture?.furnitureType;
			if (furnitureTypeId) {
				await fetchFurnitureType(furnitureTypeId);
				await fetchMaterials(furnitureTypeId);
			}
		} catch (error) {
			toast.error("An error occurred while fetching order details.");
		} finally {
			setLoading(false);
		}
	};

	const fetchFurnitureType = async (furnitureTypeId) => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/furniture-types/${furnitureTypeId}`,
				{
					method: "GET",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (!response.ok) {
				const errorData = await response.json();
				toast.error(errorData.error || "Failed to fetch furniture type.");
				return;
			}
			const existingFurnitureType = await response.json();
			setFurnitureType(existingFurnitureType.name);
		} catch (error) {
			toast.error("An error occurred while fetching furniture type.");
		}
	};

	const fetchMaterials = async (furnitureTypeId) => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/materials/${furnitureTypeId}`,
				{
					method: "GET",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (!response.ok) {
				const errorData = await response.json();
				toast.error(errorData.error || "Failed to fetch materials.");
				return;
			}
			const existingMaterials = await response.json();
			setMaterials(existingMaterials);
			console.log("Materials:", existingMaterials);
		} catch (error) {
			toast.error("An error occurred while fetching materials.");
		}
	};

	useEffect(() => {
		fetchOrder(); // Fetch order and furniture type in sequence
	}, [orderId]);

	const handleAccept = async () => {
		if (order.type === "ImageUpload") {
			if (!price || isNaN(price) || price <= 0) {
				toast.error("Please enter a valid price.");
				return;
			}
		}

		try {
			const response = await fetch(
				`http://localhost:3000/api/admin/accept-order/${orderId}`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ price }),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				toast.error(errorData.message);
				return;
			}

			const responseData = await response.json();
			console.log("Order Response:", responseData);
			toast.success("Order accepted successfully!");
			setPrice("");
			setTimeout(() => {
				navigate("/dashboard");
			}, 2000);
			fetchOrder();
		} catch (error) {
			toast.error("An error occurred while accepting the order.");
			console.error("Error:", error.message);
		}
	};

	const handleCancel = async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/admin/cancel-order/${orderId}`,
				{
					method: "PUT",
					credentials: "include",
				}
			);
			if (!response.ok) {
				const errorData = await response.json();
				toast.error(errorData.error || "Failed to cancel the order.");
				return;
			}
			toast.success("Order canceled successfully!");
			setTimeout(() => {
				navigate("/dashboard");
			}, 2000);
			fetchOrder();
		} catch (error) {
			toast.error("An error occurred while canceling the order.");
			console.log(error.message);
		}
	};

	// New function to update order status
	const handleUpdateStatus = async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/orders/update/${orderId}`,
				{
					method: "PUT",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ orderStatus: newStatus }), // Send the new status
				}
			);
			if (!response.ok) {
				const errorData = await response.json();
				toast.error(errorData.message || "Failed to update order status.");
				return;
			}
			toast.success("Order status updated successfully!");
			fetchOrder(); // Refresh the order details
		} catch (error) {
			toast.error("An error occurred while updating order status.");
			console.log(error.message);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p className="text-lg text-black">Loading order details...</p>
			</div>
		);
	}
	if (!order) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p className="text-lg text-black">Order not found</p>
			</div>
		);
	}
	const orderItems = Array.isArray(order.items) ? order.items : [];
	return (
		<section className="bg-gray-100 py-12">
			{order.type === "ImageUpload" ? (
				<>
					<div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Order Summary */}
							<div className="bg-white rounded-lg shadow-md p-6">
								<h2 className="text-2xl font-semibold text-black mb-4">
									Order Summary
								</h2>
								<ul className="space-y-2 text-black">
									<li>
										<span className="font-medium text-xl text-gray-800">
											Name:
										</span>{" "}
										{order.user.firstname} {order.user.lastname}
									</li>
									<li>
										<span className="font-medium text-xl text-gray-800">
											Order ID:
										</span>{" "}
										{order.orderNumber}
									</li>
									<li>
										<span className="font-medium text-xl text-gray-800">
											Date:
										</span>{" "}
										{new Date(order.createdAt).toLocaleDateString()}
									</li>
									<li>
										<span className="font-medium text-xl text-gray-800">
											Payment Method:
										</span>{" "}
										{order.paymentMethod || "N/A"}
									</li>
									<li>
										<div className="ml-1 text-base text-black">
											Address:
											{order.user.addresses
												.filter((address) => address.isDefault)
												.map((defaultAddress, index) => (
													<p key={index} className="tracking-wide mt-1">
														{defaultAddress.streetAddress},{" "}
														{defaultAddress.barangay},{" "}
														{defaultAddress.municipality},{" "}
														{defaultAddress.zipCode}
													</p>
												))}
										</div>
									</li>
									<li>
										<p>
											<span className="font-semibold text-gray-800">
												Status: {""}
											</span>
											<span
												className={`font-semibold ${
													order.orderStatus === "pending"
														? "text-yellow-600"
														: order.orderStatus === "confirmed"
														? "text-blue-600"
														: order.orderStatus === "shipped"
														? "text-purple-600"
														: order.orderStatus === "out for delivery"
														? "text-orange-600"
														: order.orderStatus === "delivered"
														? "text-green-600"
														: order.orderStatus === "cancelled"
														? "text-red-600"
														: order.orderStatus === "failed to deliver"
														? "text-red-500"
														: order.orderStatus === "repaired"
														? "text-pink-600"
														: "text-gray-600"
												}`}
											>
												{order.orderStatus}
											</span>
										</p>
									</li>
								</ul>
								{/* Dropdown for updating order status */}
								<div className="mt-4">
									<label className="block text-gray-700">Update Status:</label>
									<select
										value={newStatus}
										onChange={(e) => setNewStatus(e.target.value)}
										className="mt-1 block w-full border border-gray-300 rounded-md p-2"
									>
										<option value="pending">Pending</option>
										<option value="confirmed">Confirmed</option>
										<option value="out for delivery">Out for Delivery</option>
										<option value="delivered">Delivered</option>
										<option value="failed to deliver">Failed to Deliver</option>
										<option value="repaired">Repaired</option>
										<option value="cancelled">Cancelled</option>
									</select>
									{order.isConfirmed ? (
										<button
											onClick={handleUpdateStatus}
											className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
										>
											Update Status
										</button>
									) : (
										<button
											disabled
											className="mt-2 px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
										>
											Update Status
										</button>
									)}
								</div>
							</div>

							{/* Order Items */}
							<div className="bg-white rounded-lg shadow-md p-6">
								<div className="overflow-x-auto">
									<h1 className="text-xl py-2">Stocks Monitoring</h1>

									{materials.length > 0 ? (
										<table className="table-auto w-full border-collapse border border-gray-300 mb-4">
											<thead>
												<tr className="bg-gray-200 text-gray-800">
													<th className="border border-gray-300 px-4 py-2">
														Material Name
													</th>
													<th className="border border-gray-300 px-4 py-2">
														Stocks
													</th>
												</tr>
											</thead>
											<tbody>
												{materials.map((material) => (
													<tr key={material._id} className="text-gray-800">
														<td className="border border-gray-300 px-4 py-2">
															{material.name}
														</td>
														<td
															className={`border border-gray-300 px-4 py-2 ${
																material.stocks <= 3
																	? "text-red-500 font-bold"
																	: ""
															}`}
														>
															{material.stocks}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									) : (
										<p className="text-red-500">
											No materials found for this furniture type.
										</p>
									)}
									<table className="w-full border-collapse border border-gray-300">
										<thead>
											<tr className="bg-gray-300">
												<th className="py-4 px-6 text-left font-semibold text-black border border-gray-400 text-lg">
													Item
												</th>
											</tr>
										</thead>
										<tbody>
											<tr className="hover:bg-gray-50">
												<td className="py-4 px-6 text-black border border-gray-400 flex items-center space-x-6">
													{order.designImages?.map((image, imgIndex) => (
														<img
															key={imgIndex}
															src={`data:image/jpeg;base64,${image}`}
															className="w-20 h-20 object-cover rounded-lg"
															alt={`Order Image ${imgIndex}`}
															onClick={() => setSelectedImage(image)}
														/>
													))}
												</td>
											</tr>
										</tbody>
									</table>
									<div>
										{order.totalAmount ? (
											<p>Price : Php {order.totalAmount}</p>
										) : (
											<>
												<p>Price not set</p>
												<label htmlFor="price">Set Price</label>
												<input
													type="number"
													id="price"
													className="ml-2 p-2 border border-gray-300 rounded"
													placeholder="Enter price"
													onChange={(e) => setPrice(e.target.value)}
												/>
											</>
										)}
									</div>

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
									{order.orderStatus !== "pending" ? null : (
										<div className="flex justify-end space-x-4 mt-4">
											<button
												onClick={handleCancel}
												className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
											>
												Cancel
											</button>

											<button
												onClick={handleAccept}
												disabled={!price}
												className={`px-6 py-2 text-white rounded-md ${
													!price
														? "bg-gray-400 cursor-not-allowed"
														: "bg-green-500 hover:bg-green-600"
												}`}
											>
												Accept
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					<div className="container mx-auto p-6 flex flex-col">
						<div className="flex items-center mb-8">
							<button onClick={() => navigate(-1)} className="text-black">
								<IoMdArrowRoundBack size={30} />
							</button>
							<h1 className="ml-4 text-3xl font-bold text-black">
								Order Details
							</h1>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Order Summary */}
							<div className="bg-white rounded-lg shadow-md p-6">
								<h2 className="text-2xl font-semibold text-black mb-4">
									Order Summary
								</h2>
								<ul className="space-y-2 text-black">
									<li>
										<span className="font-medium text-xl text-gray-800">
											Name:
										</span>{" "}
										{order.user.firstname} {order.user.lastname}
									</li>
									<li>
										<span className="font-medium text-xl text-gray-800">
											Order ID:
										</span>{" "}
										{order.orderNumber}
									</li>
									<li>
										<span className="font-medium text-xl text-gray-800">
											Date:
										</span>{" "}
										{new Date(order.createdAt).toLocaleDateString()}
									</li>
									<li>
										<span className="font-medium text-xl text-gray-800">
											Payment Method:
										</span>{" "}
										{order.paymentMethod || "N/A"}
									</li>
									<li>
										<div className="ml-1 text-base text-black">
											Address:
											{order.user.addresses
												.filter((address) => address.isDefault)
												.map((defaultAddress, index) => (
													<p key={index} className="tracking-wide mt-1">
														{defaultAddress.streetAddress},{" "}
														{defaultAddress.barangay},{" "}
														{defaultAddress.municipality},{" "}
														{defaultAddress.zipCode}
													</p>
												))}
										</div>
									</li>
									<li>
										<p>
											<span className="font-semibold text-gray-800">
												Status: {""}
											</span>
											<span
												className={`font-semibold ${
													order.orderStatus === "pending"
														? "text-yellow-600"
														: order.orderStatus === "confirmed"
														? "text-blue-600"
														: order.orderStatus === "shipped"
														? "text-purple-600"
														: order.orderStatus === "out for delivery"
														? "text-orange-600"
														: order.orderStatus === "delivered"
														? "text-green-600"
														: order.orderStatus === "cancelled"
														? "text-red-600"
														: order.orderStatus === "failed to deliver"
														? "text-red-500"
														: order.orderStatus === "repaired"
														? "text-pink-600"
														: "text-gray-600"
												}`}
											>
												{order.orderStatus}
											</span>
										</p>
									</li>
								</ul>
								{/* Dropdown for updating order status */}
								<div className="mt-4">
									<label className="block text-gray-700">Update Status:</label>
									<select
										value={newStatus}
										onChange={(e) => setNewStatus(e.target.value)}
										className="mt-1 block w-full border border-gray-300 rounded-md p-2"
									>
										<option value="pending">Pending</option>
										<option value="confirmed">Confirmed</option>
										<option value="out for delivery">Out for Delivery</option>
										<option value="delivered">Delivered</option>
										<option value="failed to deliver">Failed to Deliver</option>
										<option value="repaired">Repaired</option>
										<option value="cancelled">Cancelled</option>
									</select>
									{order.isConfirmed ? (
										<button
											onClick={handleUpdateStatus}
											className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
										>
											Update Status
										</button>
									) : (
										<button
											disabled
											className="mt-2 px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
										>
											Update Status
										</button>
									)}
								</div>
							</div>

							{/* Order Items */}
							<div className="bg-white rounded-lg shadow-md p-6">
								<div className="flex items-center justify-between mb-4">
									<h2 className="text-2xl font-semibold">Items</h2>
									{order.expectedDelivery && (
										<h1>
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
										</h1>
									)}
								</div>

								<div className="overflow-x-auto">
									<h1 className="text-xl py-2">Stocks Monitoring</h1>

									{materials.length > 0 ? (
										<table className="table-auto w-full border-collapse border border-gray-300 mb-4">
											<thead>
												<tr className="bg-gray-200 text-gray-800">
													<th className="border border-gray-300 px-4 py-2">
														Material Name
													</th>
													<th className="border border-gray-300 px-4 py-2">
														Stocks
													</th>
												</tr>
											</thead>
											<tbody>
												{materials.map((material) => (
													<tr key={material._id} className="text-gray-800">
														<td className="border border-gray-300 px-4 py-2">
															{material.name}
														</td>
														<td
															className={`border border-gray-300 px-4 py-2 ${
																material.stocks <= 3
																	? "text-red-500 font-bold"
																	: ""
															}`}
														>
															{material.stocks}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									) : (
										<p className="text-red-500">
											No materials found for this furniture type.
										</p>
									)}
									<table className="min-w-full border-collapse border border-gray-200">
										<thead>
											<tr className="bg-gray-200">
												<th className="py-3 px-4 text-left font-medium text-black border border-gray-300">
													Item
												</th>
												<th className="py-3 px-4 text-left font-medium text-black border border-gray-300">
													Specifications
												</th>
												<th className="py-3 px-4 text-left font-medium text-black border border-gray-300">
													Quantity
												</th>
												<th className="py-3 px-4 text-left font-medium text-black border border-gray-300">
													Price
												</th>
												<th className="py-3 px-4 text-left font-medium text-black border border-gray-300">
													Total
												</th>
											</tr>
										</thead>
										<tbody>
											{order.type === "Pre-Order" ? (
												<tr className="hover:bg-gray-50">
													<td className="py-3 px-4 text-black border border-gray-300 flex items-center">
														{order.furniture?.images?.length > 0 && (
															<img
																src={`data:image/jpeg;base64,${order.furniture.images[0]}`}
																alt={order.furniture.name}
																className="w-12 h-12 object-cover mr-4 rounded-md"
															/>
														)}
														<span className="font-medium">
															{order.furniture?.name}
														</span>
													</td>
													<td className="py-3 px-4 text-black border border-gray-300">
														<div className="space-y-1">
															{order.material && (
																<p className="text-sm">
																	<span className="font-medium">Material:</span>{" "}
																	{order.material}
																</p>
															)}
															{order.color && (
																<p className="text-sm">
																	<span className="font-medium">Color:</span>{" "}
																	{order.color}
																</p>
															)}
															{order.size && (
																<p className="text-sm">
																	<span className="font-medium">Size:</span>{" "}
																	{order.size}
																</p>
															)}
														</div>
													</td>
													<td className="py-3 px-4 text-black border border-gray-300">
														{order.quantity}
													</td>
													<td className="py-3 px-4 text-black border border-gray-300">
														₱{(order.totalAmount / order.quantity).toFixed(2)}
													</td>
													<td className="py-3 px-4 text-black border border-gray-300">
														₱{order.totalAmount.toFixed(2)}
													</td>
												</tr>
											) : (
												order.items?.map((item) => (
													<tr key={item._id} className="hover:bg-gray-50">
														<td className="py-3 px-4 text-black border border-gray-300">
															<div className="flex items-center space-x-4">
																{item.furniture?.images?.length > 0 && (
																	<img
																		src={`data:image/jpeg;base64,${item.furniture.images[0]}`}
																		alt={item.furniture.name}
																		className="w-12 h-12 object-cover rounded-md"
																	/>
																)}
																<span className="font-medium">
																	{item.furniture?.name}
																</span>
															</div>
														</td>
														<td className="py-3 px-4 text-black border border-gray-300">
															<div className="space-y-1">
																{item.material && (
																	<p className="text-sm">
																		<span className="font-medium">
																			Material:
																		</span>{" "}
																		{item.material}
																	</p>
																)}
																{item.color && (
																	<p className="text-sm">
																		<span className="font-medium">Color:</span>{" "}
																		{item.color}
																	</p>
																)}
																{item.size && (
																	<p className="text-sm">
																		<span className="font-medium">Size:</span>{" "}
																		{item.size}
																	</p>
																)}
															</div>
														</td>
														<td className="py-3 px-4 text-black border border-gray-300">
															{item.quantity}
														</td>
														<td className="py-3 px-4 text-black border border-gray-300">
															₱ {order.totalAmount / item.quantity.toFixed(2)}
														</td>
														<td className="py-3 px-4 text-black border border-gray-300">
															₱ {order.totalAmount}
														</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
								<div className="mt-6 space-y-2">
									<div className="flex justify-between text-gray-800">
										<span>Furniture Type:</span>
										<span>{furnitureType}</span>
									</div>
									<div className="flex justify-between text-gray-800">
										<span>Subtotal:</span>
										<span>₱{order.totalAmount?.toFixed(2) || "0.00"}</span>
									</div>
									<div className="flex justify-between text-gray-800">
										<span>Shipping Fee:</span>
										<span>₱{order.shippingFee?.toFixed(2) || "0.00"}</span>
									</div>
									<div className="flex justify-between font-medium text-xl text-gray-800 pt-2 border-t">
										<span>Total:</span>
										<span>
											₱{order.totalAmountWithShipping?.toFixed(2) || "0.00"}
										</span>
									</div>
									{order.paymentOption === "Partial Payment" && (
										<div className="mt-4 pt-4 border-t space-y-2">
											<div className="flex justify-between text-gray-800">
												<span>Partial Payment:</span>
												<span>
													₱{order.partialPayment?.toFixed(2) || "0.00"}
												</span>
											</div>
											<div className="flex justify-between text-gray-800">
												<span>Remaining Balance:</span>
												<span>
													₱{order.remainingBalance?.toFixed(2) || "0.00"}
												</span>
											</div>
											<div className="flex justify-between text-gray-800">
												<span>Monthly Installment:</span>
												<span>
													₱{order.monthlyInstallment?.toFixed(2) || "0.00"}
												</span>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
						{/* Proof of Payment */}
						{order.proofOfPayment && (
							<div className="bg-white rounded-lg shadow-md p-6 my-5">
								<h2 className="text-lg font-medium text-gray-700 mb-4">
									Proof of Payment
								</h2>
								<img
									src={`data:image/jpeg;base64,${order.proofOfPayment}`}
									alt="Proof of Payment"
									className="w-full max-w-sm mx-auto rounded-md"
								/>
								{order.orderStatus !== "pending" ? null : (
									<div className="flex justify-end space-x-4 mt-4">
										<button
											onClick={handleCancel}
											className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
										>
											Cancel
										</button>
										<button
											onClick={handleAccept}
											className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
										>
											Accept
										</button>
									</div>
								)}
							</div>
						)}
					</div>
				</>
			)}
			<ToastContainer />
		</section>
	);
};

export default ViewUserOrder;
