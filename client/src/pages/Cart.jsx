import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaTruck } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
	const [items, setItems] = useState([]);
	const [count, setCount] = useState(0);
	const [totalAmount, setTotalAmount] = useState(0);
	const [proofOfPayment, setProofOfPayment] = useState(null);
	const [uploadMessage, setUploadMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
	const navigate = useNavigate(); // Hook to navigate

	// Fetch cart items from the API
	const fetchCartItems = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/cart", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});
			const data = await response.json();

			if (!data.ok) {
				toast.error(data.error)
			}
			if (data.cart && data.cart.items.length > 0) {
				setItems(data.cart.items);
				setCount(data.cart.count);
				setTotalAmount(data.cart.totalAmount);
			} else {
				setItems([]);
				setCount(0);
				setTotalAmount(0);
			}
			setLoading(false);
		} catch (error) {
			setError(error.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCartItems();
	}, []);

	// Calculate total price
	const totalPrice = totalAmount.toFixed(2);

	const handlePaymentMethodClick = (method) => {
		setSelectedPaymentMethod(method);
	};

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		setProofOfPayment(file);
		setUploadMessage(`Selected file: ${file.name}`);
	};

	const checkout = async () => {
		// Validate payment method and proof of payment
		if (!selectedPaymentMethod) {
			toast.error("Please select a payment method before checking out.");
			return;
		}
		if (!proofOfPayment) {
			toast.error("Please upload proof of payment before checking out.");
			return;
		}

		// Create FormData to include both file and payment method
		const formData = new FormData();
		formData.append("proofOfPayment", proofOfPayment);
		formData.append("paymentMethod", selectedPaymentMethod);

		try {
			const response = await fetch("http://localhost:3000/api/orders/create", {
				method: "POST",
				body: formData,
				credentials: "include",
			});

			const data = await response.json();

			if (!data.ok) {
				toast.error(data.error);
			}
			const orderId = data.order._id;
			navigate(`/order-details/${orderId}`);
			await fetchCartItems();
		} catch (error) {
			setError(error.message);
			setLoading(false);
		}
	};

	// Handle updating the quantity of an item in the cart
	const updateQuantity = async (furnitureId, newQuantity) => {
		if (newQuantity < 1) {
			toast.error("Quantity cannot be less than 1");
			return;
		}

		try {
			const response = await fetch("http://localhost:3000/api/cart", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					furnitureId,
					quantity: newQuantity,
				}),
			});
			if (!response.ok) {
				throw new Error("Failed to update item quantity");
			}
			fetchCartItems(); // Refresh cart after updating quantity
		} catch (error) {
			console.error("Error updating quantity:", error);
			toast.error("Error updating quantity");
		}
	};

	// Handle removing an item from the cart
	const removeItem = async (furnitureId) => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/cart/${furnitureId}`,
				{
					method: "DELETE",
					credentials: "include",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to remove item");
			}
			fetchCartItems();
		} catch (error) {
			console.error("Error removing item:", error);
			toast.error("Error removing item");
		}
	};

	// Handle clearing the entire cart
	const clearCart = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/cart", {
				method: "DELETE",
				credentials: "include",
			});
			if (!response.ok) {
				throw new Error("Failed to clear cart");
			}
			fetchCartItems();
		} catch (error) {
			console.error("Error clearing cart:", error);
			toast.error("Error clearing cart");
		}
	};

	if (loading) {
		return <div>Loading cart items...</div>;
	}
	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="flex flex-col min-h-screen mt-16">
			<main className="flex-grow w-2/4 mx-auto p-4">
				<div className="flex items-center mb-4 gap-5">
					<button
						onClick={() => navigate(-1)} // Navigate to the previous page
						className="text-gray-500 mr-2"
					>
						<IoMdArrowRoundBack size={30} />
					</button>
					<h2 className="text-2xl font-semibold text-green-700">Your Cart</h2>
					<button
						onClick={clearCart}
						className="text-red-600 text-lg px-4 py-2 rounded ml-auto"
					>
						Clear Cart
					</button>
				</div>
				{items.length === 0 ? (
					<p className="text-center text-gray-600">Your cart is empty.</p>
				) : (
					<>
						<div className="border-t border-gray-300 py-4">
							<ul className="divide-y divide-gray-300">
								{items.map((item) => (
									<li
										key={item.furnitureId?._id}
										className="flex items-center justify-between py-6 px-4"
									>
										{item.furnitureId && (
											<>
												<img
													src={
														item.furnitureId.images &&
														item.furnitureId.images.length > 0
															? `data:image/jpeg;base64,${item.furnitureId.images[0]}`
															: "fallback-image-url.jpg"
													}
													alt={item.furnitureId.name}
													className="w-32 h-32 object-cover mr-4"
												/>
												<div className="flex-1">
													<h3 className="text-lg font-medium">
														{item.furnitureId.name}
													</h3>
													<p className="text-gray-600">
														Price: ₱{item.furnitureId.price}
													</p>
													<p className="text-gray-600">
														Stocks : {item.furnitureId.stocks}
													</p>
												</div>
												<div className="flex items-center">
													<button
														className="px-3 py-1 border border-gray-400"
														onClick={() => {
															if (item.quantity < 1) {
																toast.error("Quantity cannot be less than zero.");
															} else {
																updateQuantity(
																	item.furnitureId._id,
																	item.quantity - 1
																);
															}
														}}
													>
														-
													</button>
													<span className="px-4">{item.quantity}</span>
													<button
														className="px-3 py-1 border border-gray-400"
														onClick={() => {
															if (
																item.furnitureId.stocks <= item.quantity
															) {
																toast.error(
																	"Cannot increase quantity. Available stock is insufficient."
																);
															} else {
																updateQuantity(
																	item.furnitureId._id,
																	item.quantity + 1
																);
															}
														}}
													>
														+
													</button>
												</div>
												<p className="ml-4 text-lg font-medium">
													₱
													{(
														parseFloat(item.furnitureId.price) * item.quantity
													).toFixed(2)}
												</p>
												<button
													className="ml-4 text-red-600 hover:text-red-800"
													onClick={() => removeItem(item.furnitureId._id)}
												>
													Remove
												</button>
											</>
										)}
									</li>
								))}
							</ul>
						</div>

						<div className="border-2 border-gray-300 p-6 rounded-lg">
							{/* QR Code Section - Top */}
							<div className="flex justify-end mr-28 pb-5">
								<img
									src="/payment-icon/qrcode.png"
									alt="qrcode"
									className="w-52 h-52"
								/>
							</div>

							{/* Payment Methods and Image Upload - Bottom row */}
							<div className="flex flex-col lg:flex-row gap-8">
								{/* Payment Methods Section */}
								<div className="flex-1">
									<div className="border-t border-gray-300 pt-5">
										<h3 className="text-lg font-semibold mb-2">
											Payment Methods:
										</h3>
										<div className="flex gap-4">
											{/* Gcash payment */}
											<button
												value="GCash"
												onClick={() => handlePaymentMethodClick("GCash")}
												className={`px-8 py-4 rounded ${
													selectedPaymentMethod === "GCash"
														? "bg-blue-700"
														: "bg-blue-500"
												} text-white`}
											>
												<img
													src="/payment-icon/gcash.png"
													alt="gcash"
													className="w-16 h-16"
												/>
											</button>
											{/* Maya payment */}
											<button
												value="Maya"
												onClick={() => handlePaymentMethodClick("Maya")}
												className={`px-8 py-4 rounded bg-black text-white`}
											>
												<img
													src="/payment-icon/maya.jpg"
													alt="maya"
													className="w-16 h-16"
												/>
											</button>
											{/* Cash on delivery payment */}
											<button
												value="COD"
												onClick={() => handlePaymentMethodClick("COD")}
												className={`px-8 py-4 rounded ${
													selectedPaymentMethod === "COD"
														? "bg-yellow-700"
														: "bg-yellow-500"
												} text-white`}
											>
												<div className="flex justify-center items-center gap-2">
													<FaTruck size={30} />
													<span className="font-semibold">COD</span>
												</div>
											</button>
										</div>
										{selectedPaymentMethod && (
											<p className="mt-5 text-gray-600">
												Selected Payment Method:{" "}
												<strong>{selectedPaymentMethod}</strong>
											</p>
										)}
									</div>
								</div>

								{/* Image Upload Section */}
								<div className="flex-1">
									<div className="w-full max-w-md border-t border-gray-300 pt-5">
										<h2 className="text-2xl font-semibold text-green-700 mb-4">
											Upload Proof of Payment
										</h2>
										<input
											type="file"
											onChange={handleFileUpload}
											className="mb-4 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600 focus:border-green-500 focus:ring-green-500"
										/>
										{uploadMessage && <p>{uploadMessage}</p>}
									</div>
								</div>
							</div>
						</div>

						<div className="border-t border-gray-300 pt-4 mt-5">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold">Subtotal:</h3>
								<p className="text-lg font-semibold">₱{totalPrice}</p>
							</div>
							<div className="flex justify-between mb-4">
								<button
									onClick={() => navigate(-1)}
									className="bg-blue-500 text-white px-4 py-2 rounded"
								>
									Continue Shopping
								</button>
								<button
									className="bg-green-500 text-white px-4 py-2 rounded"
									onClick={checkout}
								>
									Checkout
								</button>
							</div>
						</div>
					</>
				)}
			</main>
			<ToastContainer />
		</div>
	);
};

export default Cart;
