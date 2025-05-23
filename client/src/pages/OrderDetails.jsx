import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const OrderDetails = () => {
	const { orderId } = useParams();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const fetchOrder = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`http://localhost:3000/api/orders/details/${orderId}`,
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
			const data = await response.json();
			setOrder(data);
		} catch (error) {
			console.log("Error fetching order", error);
			toast.error("An error occurred while fetching order details.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrder();
	}, [orderId]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p className="text-lg text-gray-600">Loading order details...</p>
			</div>
		);
	}

	if (!order) {
		return (
			<div className="flex justify-center items-center h-screen">
				<p className="text-lg text-gray-600">Order not found</p>
			</div>
		);
	}

	const orderItems = Array.isArray(order.items) ? order.items : [];

	return (
		<div>
			<Header isLogin={true} />
			<div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-xl rounded-xl mt-5 mb-5 border-2">
				<div className="flex items-center justify-between mb-6">
					<button onClick={() => navigate(-1)} className="text-gray-500">
						<IoMdArrowRoundBack size={30} />
					</button>
					<h1 className="text-2xl md:text-3xl font-bold text-black-600 text-center flex-grow">
						Order Details
					</h1>
				</div>

				{/* Order Summary */}
				<div className="pb-6 mb-2">
					<h2 className="flex justify-between text-xl md:text-2xl ml-2 font-semibold text-black-700 mb-4">
						Order Summary <span>{order.partialPayment}</span>
					</h2>
					<div className="gap-2 text-gray-600 border-t border-black-500 p-5">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-baseline rounded-md border-black-500 p-2 shadow-md">
							<p className="font-base flex items-baseline">
								<span className="font-semibold text-black">Order ID:</span>
								<span className="ml-2 text-black">{order.orderNumber}</span>
							</p>
							<p className="flex items-baseline">
								<span className="font-semibold text-gray-800">Date:</span>
								<span className="text-black ml-2">
									{new Date(order.createdAt).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
							</p>
							<p className="flex items-baseline">
								<span className="font-semibold text-gray-800">
									Payment Method:
								</span>
								<span className="text-black ml-2">
									{order.paymentMethod || "N/A"}
								</span>
							</p>
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
											: order.orderStatus === "delivered"
											? "text-black-700"
											: order.orderStatus === "cancelled"
											? "text-red-600"
											: "text-gray-600" // Fallback color for any unexpected status
									}`}
								>
									{order.orderStatus}
								</span>
							</p>

							{/* Customer Details */}
							<div className="flex items-baseline">
								<h1 className="font-semibold text-black">Client:</h1>
								<p className="ml-2 text-black">
									{order.user.firstname} {order.user.lastname}
								</p>
							</div>
							<div className="flex">
								<h1 className="font-semibold text-black">Email:</h1>
								<p className="ml-2 text-black">{order.user.email}</p>
							</div>
							<div className="flex">
								<h1 className="font-semibold text-black">Phone Number:</h1>
								<p className="ml-2 text-black">{order.user.phoneNumber}</p>
							</div>
							<div className="flex items-baseline">
								<h1 className="font-semibold text-black">Address:</h1>
								<p className="ml-2 text-black">
									{order.user.addresses
										.filter((address) => address.isDefault)
										.map((defaultAddress, index) => (
											<p key={index} className="tracking-wide mt-1">
												{defaultAddress.streetAddress},{" "}
												{defaultAddress.barangay}, {defaultAddress.municipality}
												, {defaultAddress.zipCode}
											</p>
										))}
								</p>
							</div>
						</div>
					</div>
				</div>

				{order.type === "Cart" ? (
					<div className="border-t shadow-xl border-black-400 bg-white rounded-xl mb-5 p-4 md:p-5">
						<h2 className="text-xl md:text-2xl font-semibold text-black-700 mb-4">
							Items
						</h2>
						<div>
							{orderItems.length > 0 ? (
								orderItems.map((item) => (
									<li
										key={item._id}
										className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 border-b border-gray-200 mb-5"
									>
										<div className="flex items-start md:items-center">
											{item.furniture.images.length > 0 && (
												<img
													src={`data:image/jpeg;base64,${item.furniture.images[0]}`}
													alt={item.furniture.name}
													className="w-24 h-24 md:w-32 md:h-32 object-contain mr-4 rounded-md"
												/>
											)}
											<div>
												<p className="font-semibold text-gray-800">
													{item.furniture.name}
												</p>
												<p className="text-gray-800">Color: {item.color}</p>
												<p className="text-gray-800">
													Material: {item.material}
												</p>
												<p className="text-gray-800">Size: {item.size}</p>
											</div>
										</div>
										<div className="mt-4 md:mt-0">
											<p className="text-lg font-medium text-black-700">
												PHP {order.totalAmount} X {item.quantity}
											</p>
										</div>
									</li>
								))
							) : (
								<li className="py-4 text-gray-600">
									No items found for this order.
								</li>
							)}
						</div>
						<div className="bg-white border flex flex-col border-black-400 rounded-xl p-4 md:p-6 text-right gap-2">
							<h1>Payment Option: {order.paymentOption}</h1>
							<h1>Delivery Option: {order.deliveryMode}</h1>
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
										new Date(order.expectedDelivery.endDate).toLocaleDateString(
											"en-US",
											{
												year: "numeric",
												month: "long",
												day: "numeric",
											}
										)}
								</h1>
							)}

							<h1>Shipping Fee: ₱{order.shippingFee.toFixed(2)}</h1>
							<div className="flex justify-end">
								<p className="text-xl font-semibold mt-4 text-black-700 pr-2 pb-2">
									Total: ₱
									{order.totalAmountWithShipping
										? order.totalAmountWithShipping.toFixed(2)
										: "0.00"}
								</p>
							</div>
						</div>
					</div>
				) : (
					<div className="border-t shadow-xl border-black-400 bg-white rounded-xl mb-5 p-4 md:p-5">
						<h2 className="text-xl md:text-2xl font-semibold text-black-700 mb-4">
							Item
						</h2>
						<div>
							<div className="flex items-start md:items-center mb-5">
								{order.furniture.images.length > 0 && (
									<img
										src={`data:image/jpeg;base64,${order.furniture.images[0]}`}
										alt={order.furniture.name}
										className="w-38 h-38 object-contain mr-4 rounded-md"
									/>
								)}
								<div className="flex p-5 flex-col gap-2">
									<p className="font-semibold text-gray-800">
										{order.furniture.name}
									</p>
									<p>Material: {order.material}</p>
									<p>Color: {order.color}</p>
									<p>Size: {order.size}</p>
									<p>Quantity: {order.quantity}</p>
									<p className="font-semibold text-lg mt-5">
										Subtotal:{" "}
										<span className="font-normal">₱ {order.subtotal}</span>{" "}
									</p>
								</div>
							</div>
						</div>
						<div className="bg-white border flex border-black-400 rounded-xl p-4 md:p-6 text-right gap-2">
							<div className="flex flex-1"></div>
							{order.paymentOption === "Full Payment" ? (
								<div>
									<h1>Payment Option: {order.paymentOption}</h1>
									<h1>Delivery Option: {order.deliveryMode}</h1>
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
									<h1>Shipping Fee: ₱ {order.shippingFee.toFixed(2)}</h1>
									<div className="flex justify-end">
										<p className="text-xl font-semibold mt-4 text-black-700 pr-2 pb-2">
											Total: ₱
											{order.totalAmountWithShipping
												? order.totalAmountWithShipping.toFixed(2)
												: "0.00"}
										</p>
									</div>
								</div>
							) : (
								<div>
									<h1>Payment Option: {order.paymentOption}</h1>
									<h1>Delivery Option: {order.deliveryMode}</h1>
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
									<h1>Shipping Fee: ₱ {order.shippingFee}</h1>
									<br />
									<h1>
										Partial Payment (50%): ₱ {order.partialPayment.toFixed(2)}
									</h1>
									<h1>
										Remaing Balance: ₱ {order.remainingBalance.toFixed(2)}
									</h1>
									<h1>
										Monthly Installment: ₱ {order.monthlyInstallment.toFixed(2)}
									</h1>
									<p className="text-lg font-semibold mt-4 text-black-700 pr-2 pb-2">
										Total Amount: ₱
										{order.totalAmountWithShipping
											? order.totalAmountWithShipping.toFixed(2)
											: "0.00"}
									</p>
									<br />
								</div>
							)}
						</div>
					</div>
				)}

				{/* Proof of Payment */}
				{order.proofOfPayment && (
					<div className="border-t border-teal-500 p-4 md:p-6 mb-6 rounded-xl shadow-xl">
						<h2 className="text-xl md:text-2xl font-semibold text-black-700 mb-2">
							Proof of Payment
						</h2>
						<div className="flex flex-col md:flex-row items-start gap-8">
							<div className="min-w-[250px] md:min-w-[400px] h-[250px] md:h-[400px] overflow-hidden border rounded-md">
								<img
									src={`data:image/jpeg;base64,${order.proofOfPayment}`}
									alt="Proof of Payment"
									className="w-full h-full object-contain"
								/>
							</div>
							<div className="flex flex-col flex-1">
								<div className="flex-1 bg-black-50 p-4 md:p-6 rounded-lg">
									<h3 className="text-lg md:text-xl font-semibold text-black-700 mb-2">
										Thank You for Your Purchase!
									</h3>
									<p className="text-black text-base mb-2">
										We greatly appreciate your business and trust in our
										products.
									</p>
									<p className="text-black text-base">
										Your payment is being processed. You will receive order
										confirmation in your Muebles account after the payment
										process. We'll keep you updated on its status.
									</p>
									<p>Have a good day!</p>
								</div>
								<div>
									<button
										onClick={() => navigate("/home")}
										className="bg-blue-500 text-white px-4 py-2 rounded"
									>
										Continue Shopping
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				<ToastContainer />
			</div>
			<Footer />
		</div>
	);
};

export default OrderDetails;
