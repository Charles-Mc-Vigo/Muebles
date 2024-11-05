import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
		<div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-md mt-10">
			<div className="flex items-center justify-between mb-6">
				<button onClick={() => navigate(-1)} className="text-gray-500">
					<IoMdArrowRoundBack size={30} />
				</button>
				<h1 className="text-3xl font-bold text-green-700 text-center flex-grow">
					Order Details
				</h1>
			</div>
			<div className="border-b pb-6 mb-6">
				<h2 className="text-2xl font-semibold text-green-700 mb-4">
					Order Summary
				</h2>
				{/* order details */}
				<div className="grid grid-cols-2 gap-4 text-lg text-gray-600">
					<div>
						<p>
							<span className="font-semibold text-gray-800">Order ID:</span>{" "}
							{order.orderNumber}
						</p>
						<p>
							<span className="font-semibold text-gray-800">Date:</span>{" "}
							{new Date(order.createdAt).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>
					</div>
					<div>
						<p>
							<span className="font-semibold text-gray-800">
								Payment Method:
							</span>{" "}
							{order.paymentMethod || "N/A"}
						</p>
						<p>
							<span className="font-semibold text-gray-800">Status:</span>{" "}
							<span
								className={`${
									order.orderStatus === "pending"
										? "text-yellow-600"
										: "text-green-700"
								} font-semibold`}
							>
								{order.orderStatus}
							</span>
						</p>
					</div>
				</div>
				{/* user details */}
				<div className="bg-slate-200 p-2 m-2">
					<h1>
						Client : {order.user.firstname} {order.user.lastname}
					</h1>
					<h1>Email : {order.user.email}</h1>
					<h1>Phone Number : {order.user.phoneNumber}</h1>
					<div className="flex justify-between">
						<h1>Shipping Address :</h1>
						{order.user.addresses
							.filter((address) => address.isDefault)
							.map((defaultAddress, index) => (
								<div key={index}>
									<p className="tracking-wide mr-2">
										{defaultAddress.streetAddress}, {defaultAddress.barangay},{" "}
										{defaultAddress.municipality}, {defaultAddress.zipCode}
									</p>
								</div>
							))}
					</div>
				</div>
			</div>
			<div className="border-b pb-6 mb-6">
				<h2 className="text-2xl font-semibold text-green-700 mb-4">Items</h2>
				<ul>
					{orderItems.length > 0 ? (
						orderItems.map((item) => (
							<li
								key={item._id}
								className="flex justify-between items-center py-4 border-b border-gray-200"
							>
								<div className="flex items-center">
									{item.furniture.images.length > 0 && (
										<img
											src={`data:image/jpeg;base64,${item.furniture.images[0]}`}
											alt={item.furniture.name}
											className="w-20 h-20 object-cover mr-4 rounded-md"
										/>
									)}
									<div>
										<p className="font-semibold text-gray-800">
											{item.furniture.name}
										</p>
										<p className="text-gray-800">Color : {item.color}</p>
										<p className="text-gray-800">Material : {item.material}</p>
										<p className="text-gray-800">Size : {item.size}</p>
										<p className="text-gray-600">
											Quantity: {item.quantity} x ₱{item.price.toFixed(2)}
										</p>
									</div>
								</div>
								<p className="text-lg font-medium text-green-700">
									₱{(item.price * item.quantity).toFixed(2)}
								</p>
							</li>
						))
					) : (
						<li className="py-4 text-gray-600">
							No items found for this order.
						</li>
					)}
				</ul>
				{/* payment method at delivery method */}
				<div className="bg-slate-200 p-2 m-2 flex flex-col text-right">
					<h1>Delivery Option: {order.deliveryMode}</h1>
					<h1>Subtotal: {order.subtotal}</h1>
					<h1>Shipping Fee: {order.shippingFee}</h1>
					<p className="text-right text-xl font-semibold mt-4 text-green-700">
						Total: ₱{order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
					</p>
				</div>
			</div>
			{/* Display the proof of payment with thank you message */}
			{order.proofOfPayment && (
				<div className="border-b pb-6 mb-6">
					<h2 className="text-2xl font-semibold text-green-700 mb-4">
						Proof of Payment
					</h2>
					<div className="flex items-start gap-8">
						<div className="min-w-[300px] max-w-[300px] h-[400px] overflow-hidden border rounded-md">
							<img
								src={`data:image/jpeg;base64,${order.proofOfPayment}`}
								alt="Proof of Payment"
								className="w-full h-full object-contain"
							/>
						</div>
						<div className="flex-1 bg-green-50 p-6 rounded-lg">
							<h3 className="text-xl font-semibold text-green-700 mb-2">
								Thank You for Your Purchase!
							</h3>
							<p className="text-gray-700 mb-2">
								We greatly appreciate your business and trust in our products.
							</p>
							<p className="text-gray-700">
								Your payment is being processed at the moment. You will receive
								order confirmation in your Muebles account after the payment
								process. We'll keep you updated on its status.
							</p>
							<p>Have a good day!</p>
						</div>
					</div>
				</div>
			)}
			<ToastContainer />
		</div>
	);
};

export default OrderDetails;
