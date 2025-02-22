import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaLocationDot, FaTruckFast } from "react-icons/fa6";
import { BsShop } from "react-icons/bs";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Cart = () => {
	const [items, setItems] = useState([]);
	const [deliveryMode, setDeliveryMode] = useState("delivery");
	const [user, setUser] = useState({ addresses: [] });
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [count, setCount] = useState(0);
	const [totalAmount, setTotalAmount] = useState(0);
	const [shippingFee, setShippingFee] = useState(0);
	const [proofOfPayment, setProofOfPayment] = useState(null);
	const [uploadMessage, setUploadMessage] = useState("");
	const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
	const [paymentOption, setSelectedPaymentOption] = useState("Partial Payment");
	const [referenceNumber, setReferenceNumber] = useState(null);
	const [amountPaid, setAmountPaid] = useState(null);

	const navigate = useNavigate();
	const shippingFees = {
		Boac: 500,
		Mogpog: 700,
		Gasan: 500,
		Buenavista: 800,
		Santa_Cruz: 3000,
		Torrijos: 3000,
	};

	useEffect(() => {
		if (items.length > 0) {
			const maxECT = Math.max(...items.map((item) => item.ECT || 0));
			const startDeliveryDate = new Date();
			startDeliveryDate.setDate(startDeliveryDate.getDate() + maxECT);
			const endDeliveryDate = new Date(startDeliveryDate);
			endDeliveryDate.setDate(endDeliveryDate.getDate() + 2);
			const formatDeliveryDates = (startDate, endDate) => {
				const options = { month: "short", year: "numeric" };
				const monthAndYear = startDate.toLocaleDateString("en-US", options);
				const startDay = startDate.getDate();
				const endDay = endDate.getDate();
				return `${startDay} - ${endDay} ${monthAndYear}`;
			};
			const estimatedDelivery = formatDeliveryDates(
				startDeliveryDate,
				endDeliveryDate
			);
			setExpectedDeliveryDate(estimatedDelivery);
		} else {
			setExpectedDeliveryDate(null);
		}
	}, [items]);

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
				toast.error(data.error);
			}
			if (data.cart && data.cart.items.length > 0) {
				setItems(data.cart.items);
				setCount(data.cart.count);
				setTotalAmount(data.cart.totalAmount);
				setUser(data.cart.userId);
				console.log(data.cart.userId);
				const defaultAddress = data.cart.userId.addresses?.find(
					(address) => address.isDefault
				);
				if (defaultAddress) {
					setSelectedAddress(defaultAddress._id);
				}
			} else {
				setItems([]);
				setCount(0);
				setTotalAmount(0);
				setUser({ addresses: [] });
			}
			setLoading(false);
		} catch (error) {
			setError(error.message);
			setLoading(false);
		}
	};

	// console.log(items);

	useEffect(() => {
		fetchCartItems();
	}, []);

	useEffect(() => {
		if (user?.addresses?.length > 0 && selectedAddress) {
			const address = user.addresses.find(
				(address) => address._id === selectedAddress
			);

			// Check if the delivery mode is 'pickup'
			if (deliveryMode === "pickup") {
				setShippingFee(0); // No shipping fee for pick up
			} else {
				const fee = shippingFees[address?.municipality] || 0;
				setShippingFee(fee);
			}
		} else {
			setShippingFee(0);
		}
	}, [selectedAddress, user, deliveryMode]); // Added deliveryMode to dependencies

	const totalAmountWithShippingFee = (totalAmount + shippingFee).toFixed(2);

	// kapag partial payment
	const partialPaymentAmount = ((totalAmount + shippingFee) / 2).toFixed(2);

	const remainingBalance = (
		totalAmount +
		shippingFee -
		partialPaymentAmount
	).toFixed(2);

	const montlyInstallment = (remainingBalance / 3).toFixed(2);

	// kapag full payment
	const fullPayment = totalAmountWithShippingFee;
	// console.log("partial", partialPaymentAmount);

	const handlePaymentMethodClick = (method) => {
		setSelectedPaymentMethod(method);
	};

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		setProofOfPayment(file);
		setUploadMessage(`Selected file: ${file.name}`);
	};

	const preOrderFromCart = async () => {
		if (!selectedPaymentMethod) {
			toast.error("Please select a payment method before checking out.");
			return;
		}
		if (!proofOfPayment) {
			toast.error("Please upload proof of payment before checking out.");
			return;
		}
		const addressToSend = user.addresses.find(
			(address) => address._id === selectedAddress
		);
		const formData = new FormData();
		formData.append("proofOfPayment", proofOfPayment);
		formData.append("paymentOption", paymentOption);
		formData.append("paymentMethod", selectedPaymentMethod);
		formData.append("shippingAddress", JSON.stringify(addressToSend));
		formData.append("deliveryMode", deliveryMode);
		formData.append("expectedDelivery", expectedDeliveryDate);
		formData.append("totalAmount", totalAmount);
		formData.append("shippingFee", shippingFee);
		formData.append("totalAmountWithShippingFee", totalAmountWithShippingFee);
		formData.append("partialPaymentAmount", partialPaymentAmount);
		// formData.append("amountPaid", amountPaid);
		// not yet done
		formData.append("remainingBalance", remainingBalance);
		formData.append("montlyInstallment", montlyInstallment);

		// Log FormData contents
		for (const [key, value] of formData.entries()) {
			console.log(`${key}:`, value);
		}

		try {
			const response = await fetch("http://localhost:3000/api/orders/create", {
				method: "POST",
				body: formData,
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error(response.message);
			}
			const data = await response.json();
			if (!data.ok) {
				toast.error(data.error);
			}

			const orderId = data.order._id;
			await clearCart();
			navigate(`/order-details/${orderId}`);
			await fetchCartItems();
		} catch (error) {
			setError(error.message);
			setLoading(false);
		}
	};

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
			fetchCartItems();
		} catch (error) {
			console.error("Error updating quantity:", error);
			toast.error("Error updating quantity");
		}
	};

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

	const clearCart = async () => {
		setLoading(true);
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
		setLoading(false);
	};

	if (loading) {
		return <div>Loading cart items...</div>;
	}
	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="flex flex-col min-h-screen">
			<Header isLogin={true} cartCount={true} />
			<main className="flex-grow w-2/4 mx-auto p-4 mt-5">
				<div className="flex items-center mb-4 gap-5 border-b-2 border-green-600">
					<button
						onClick={() => navigate(-1)}
						className="text-gray-500 mr-2 hover:text-green-600"
					>
						<IoMdArrowRoundBack size={40} />
					</button>
					<h2 className="text-2xl font-semibold text-green-600">Your Cart</h2>
					<button
						onClick={clearCart}
						disabled={loading}
						className="text-red-600 hover:text-red-200 font-semibold text-xl px-4 py-2 rounded ml-auto"
					>
						{loading ? "Clearing..." : "Clear"}
					</button>
				</div>
				{items.length === 0 ? (
					<p className="text-center font-bold text-2xl text-green-600">
						Your cart is empty.
					</p>
				) : (
					<>
						{/* Customer Information */}
						<div className="bg-white shadow-2xl mt-2 border-t rounded-2xl">
							<div className="mt-2 p-2 flex items-center text-black font-medium">
								<div className="flex flex-grow mr-2">
									<FaLocationDot className="mr-2 text-green-600 text-xl" />
									<div className="flex items-center">
										{user.firstname || "N/A"} {user.lastname || "N/A"}{" "}
										{user.phoneNumber || "N/A"}
									</div>
								</div>
							</div>
							{/* Address Section Below */}
							<div className="text-base flex font-medium ml-7 pb-3 justify-between items-center">
								{user.addresses && user.addresses.length > 0 ? (
									user.addresses
										.filter((address) => address.isDefault)
										.map((defaultAddress, index) => (
											<p key={index} className="tracking-wide p-2">
												{defaultAddress.streetAddress},{" "}
												{defaultAddress.barangay}, {defaultAddress.municipality}
												, {defaultAddress.zipCode}
											</p>
										))
								) : (
									<p>No addresses available</p>
								)}
								<button
									onClick={() => navigate("/address/new")}
									className="text-green-600 flex items-center font-semibold mr-5"
								>
									<MdOutlineKeyboardArrowRight
										style={{ fontSize: "3rem" }}
										className="ml-2"
									/>
								</button>
							</div>
						</div>
						{/* Product information & delivery */}
						<div className="py-4 mt-2 bg-white rounded-xl border-t ">
							<div className="flex text-2xl font-semibold border-b border-green-500">
								<BsShop className="text-2xl text-green-600 ml-2" />
								<h1 className="text-2xl ml-2">JCKAME</h1>
							</div>
							<div>
								<ul className="divide-y divide-gray-300 ">
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
														className="w-32 h-32 object-contain mr-4"
													/>
													<div className="flex-1">
														<h3 className="text-lg font-medium">
															{item.furnitureId.name}
														</h3>
														<p className="text-gray-600">Color: {item.color}</p>
														<p className="text-gray-600">
															Material: {item.material}
														</p>
														<p className="text-gray-600">
															Price: ₱{item.price}
														</p>
													</div>
													<div className="flex items-center">
														<button
															className="px-3 py-1 border border-gray-400"
															onClick={() => {
																if (item.quantity < 1) {
																	toast.error(
																		"Quantity cannot be less than zero."
																	);
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
															onClick={() =>
																updateQuantity(
																	item.furnitureId._id,
																	item.quantity + 1
																)
															}
														>
															+
														</button>
													</div>
													<p className="ml-4 text-lg font-medium">
														₱
														{(parseFloat(item.price) * item.quantity).toFixed(
															2
														)}
													</p>
													<button
														className="ml-4 text-green-600 hover:green-red-800"
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
							{/* Delivery Method  */}
							<div className="flex flex-col pl-2  border rounded-xl shadow-xl border-green-500">
								<div className="flex items-center text-xl font-semibold ml-4 mb-5 px-3 py-2">
									<FaTruckFast className="mr-2 text-green-600" />
									<span>Delivery Option:</span>
								</div>
								<div className="flex gap-3 text-lg font-normal pr-2 ml-6 mb-2">
									<label className="text-base">
										<input
											style={{ margin: "7px" }}
											type="radio"
											name="deliveryMode"
											value="delivery"
											checked={deliveryMode === "delivery"}
											onChange={(e) => setDeliveryMode(e.target.value)}
										/>
										Delivery
									</label>
									<label className="text-base text-black">
										<input
											style={{ margin: "7px", color: "Black" }}
											type="radio"
											name="deliveryMode"
											value="pickup"
											checked={deliveryMode === "pickup"}
											onChange={(e) => setDeliveryMode(e.target.value)}
										/>
										Pick Up
									</label>
								</div>
								<div className="bg-slate-100 p-2 px-4 rounded m-2">
									{expectedDeliveryDate && (
										<div className="flex justify-between">
											<span className="font-semibold">Expected Delivery:</span>
											<span>{expectedDeliveryDate}</span>
										</div>
									)}
								</div>
							</div>
						</div>
						{/* Payment method selection */}
						<div className="shadow-xl border-t-2 mb-2 p-6 rounded-xl">
							<div className="flex flex-col bg-slate-100 p-5">
								<div className="bg-slate-50">
									<p>
										<strong>Partial Payment</strong> (3-Month Plan) <br /> Pay
										in installments with 50% down payment and remaining balance
										can be paid over a minimum of 3 months. 3% Interest applies
										only if payments are not made on time.
									</p>
									<br />
									<p>
										<strong>Full Payment</strong> <br /> Pay the entire amount
										upfront with no additional charges.
									</p>
								</div>

								<h3 className="text-lg font-semibold mt-5 mb-2">
									Payment Options:
								</h3>
								<label className="flex items-center mb-2">
									<input
										type="radio"
										value="Partial Payment"
										checked={paymentOption === "Partial Payment"}
										onChange={() => setSelectedPaymentOption("Partial Payment")}
										className="mr-2"
									/>
									Partial Payment
								</label>
								<label className="flex items-center">
									<input
										type="radio"
										value="Full Payment"
										checked={paymentOption === "Full Payment"}
										onChange={() => setSelectedPaymentOption("Full Payment")}
										className="mr-2"
									/>
									Full Payment
								</label>
							</div>
						</div>
						{/* Payment method */}
						<div>
							<h3 className="text-lg font-semibold mb-2">Payment Methods:</h3>
							<div className="flex justify-end text-center bg-slate-200 p-5 gap-5">
								{/* Gcash payment */}
								<button
									value="GCash"
									onClick={(event) => handlePaymentMethodClick("GCash", event)}
									className={`rounded relative p-2 transition-all duration-200 ${
										selectedPaymentMethod === "GCash"
											? "border-2 border-green-600 bg-white shadow-lg transform scale-105"
											: "border border-gray-300 bg-slate-200 hover:border-green-400"
									}`}
								>
									<img
										src="/payment-icon/gcash.png"
										alt="gcash"
										className="w-20 h-20 object-contain rounded"
									/>
									{selectedPaymentMethod === "GCash" && (
										<div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
											<span className="text-white text-sm">✓</span>
										</div>
									)}
								</button>
								{/* Maya payment */}
								<button
									value="Maya"
									onClick={(event) => handlePaymentMethodClick("Maya", event)}
									className={`rounded relative p-2 transition-all duration-200 ${
										selectedPaymentMethod === "Maya"
											? "border-2 border-green-600 bg-white shadow-lg transform scale-105"
											: "border border-gray-300 bg-slate-200 hover:border-green-400"
									}`}
								>
									<img
										src="/payment-icon/maya.jpg"
										alt="maya"
										className="w-20 h-20 object-contain rounded"
									/>
									{selectedPaymentMethod === "Maya" && (
										<div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
											<span className="text-white text-sm">✓</span>
										</div>
									)}
								</button>
							</div>
							{selectedPaymentMethod && (
								<p className="mt-5 text-gray-600">
									Selected Payment Method:{" "}
									<strong>{selectedPaymentMethod}</strong>
								</p>
							)}
						</div>

						{/* QR code for payment */}
						{selectedPaymentMethod === "Maya" && (
							<div className="mt-5 p-5 bg-slate-200">
								<h1 className="text-xl font-semibold mb-2">Scan the QR Code</h1>
								<div className="flex items-start gap-8">
									{/* QR Code Section */}
									<div className="flex flex-col items-center">
										<img
											src="/payment-icon/Maya-qr.png"
											alt="qrcode"
											className="w-40 h-40 object-contain"
										/>
									</div>
									{/* Image Upload Section */}
									<div className="flex-1 max-w-md pt-5">
										<h2 className="text-2xl font-semibold text-green-600 mb-4">
											Upload Proof of Payment
										</h2>
										<input
											type="file"
											onChange={handleFileUpload}
											className="mb-4 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600 focus:border-green-600 focus:ring-green-500"
										/>
										{uploadMessage && <p>{uploadMessage}</p>}
									</div>

									{paymentOption === "Partial Payment" && (
										<div className="mt-5 mb-5">
											<div>
												<h1>Reference Number</h1>
												<input
													type="number"
													className="py-2 px-4 bg-slate-100 rounded-md"
													value={referenceNumber}
													onChange={(e) => setReferenceNumber(e.target.value)}
												/>
											</div>
											<div>
												<h1>Amount Paid</h1>
												<input
													type="number"
													className="py-2 px-4 bg-slate-100 rounded-md"
													value={amountPaid}
													onChange={(e) => setAmountPaid(e.target.value)}
												/>
											</div>
											{amountPaid &&
												parseFloat(amountPaid) !==
													parseFloat(partialPaymentAmount) && (
													<p className="text-red-600">
														Amount paid should match the partial payment amount
														of ₱{partialPaymentAmount}
													</p>
												)}
										</div>
									)}
								</div>
							</div>
						)}

						{selectedPaymentMethod === "GCash" && (
							<div className="mt-5 p-5 bg-slate-200">
								<h1 className="text-xl font-semibold mb-2">Scan the QR Code</h1>
								<div className="flex items-start gap-8">
									{/* QR Code Section */}
									<div className="flex flex-col items-center">
										<img
											src="/payment-icon/GCash-qr.png"
											alt="qrcode"
											className="w-40 h-40 object-contain"
										/>
									</div>
									{/* Image Upload Section */}
									<div className="flex-1 max-w-md pt-5">
										<h2 className="text-2xl font-semibold text-green-600 mb-4">
											Upload Proof of Payment
										</h2>
										<input
											type="file"
											onChange={handleFileUpload}
											className="mb-4 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600 focus:border-green-600 focus:ring-green-500"
										/>
										{uploadMessage && <p>{uploadMessage}</p>}
									</div>
									{/* for reference number */}
									<div>
										<h1>Reference Number</h1>
										<input
											type="number"
											className="py-2 px-4 bg-slate-100 rounded-md"
											value={referenceNumber}
											onChange={(e) => setReferenceNumber(e.target.value)}
										/>
									</div>
									{/* for specific fee */}
									<div>
										<h1>Specific Fee</h1>
										<input
											type="number"
											className="py-2 px-4 bg-slate-100 rounded-md"
											value={amountPaid}
											onChange={(e) => setAmountPaid(e.target.value)}
										/>
										{paymentOption === "Partial Payment" &&
											amountPaid &&
											parseFloat(amountPaid) !==
												parseFloat(partialPaymentAmount) && (
												<p className="text-red-600">
													Amount paid should match the partial payment amount of
													₱{partialPaymentAmount}
												</p>
											)}
										{paymentOption === "Full Payment" &&
											amountPaid &&
											parseFloat(amountPaid) !== parseFloat(fullPayment) && (
												<p className="text-red-600">
													Amount paid should match the full payment amount of ₱
													{fullPayment}
												</p>
											)}
									</div>
								</div>
							</div>
						)}

						{/* Payment Details */}
						<div className="border-t-2 p-5 rounded-xl shadow-xl bg-white ">
							<div className="mt-2 ">
								<h1 className="text-2xl font-semibold mb-2">Payment Details</h1>
								<div className="text-lg font-normal">
									<div className="flex justify-between">
										<span>Items total:</span>
										<span>₱ {totalAmount.toFixed(2)}</span>
									</div>
									<div className="flex justify-between">
										<span>Shipping Fee:</span>
										<span>₱ {shippingFee.toFixed(2)}</span>
									</div>
									{/* payable amount dito */}
									<div className="mt-5">
										{paymentOption === "Partial Payment" ? (
											<div className="flex flex-col">
												<div className="flex justify-between">
													<h3 className="font-semibold">Total:</h3>
													<p>₱ {totalAmountWithShippingFee}</p>
												</div>

												<div className="flex justify-between">
													<h3 className="font-semibold">
														Partial Payment (50%):
													</h3>
													<p>₱ {partialPaymentAmount}</p>
												</div>
												<div className="flex justify-between">
													<h3 className="font-semibold">
														Montly Installment (3 months):
													</h3>
													<p>₱ {montlyInstallment}</p>
												</div>
											</div>
										) : (
											<div className="flex justify-between">
												<h3 className="text-lg font-semibold">
													Total Payment:
												</h3>
												<p className="font-bold">PHP {fullPayment}</p>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* For payment. need design improvement */}
							<div className="border-t border-green-600 pt-4 mt-5">
								<div className="flex justify-between mb-4">
									<button
										onClick={() => navigate(-1)}
										className="bg-blue-500 text-white px-4 py-2 rounded"
									>
										Continue Shopping
									</button>
									<button
										className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-800"
										disabled={loading}
										onClick={preOrderFromCart}
									>
										{loading ? "Creating Pre-Order..." : "Create Pre-Order"}
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</main>
			<ToastContainer />
			<Footer />
		</div>
	);
};

export default Cart;
