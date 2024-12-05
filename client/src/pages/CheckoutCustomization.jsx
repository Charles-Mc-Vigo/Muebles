import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { TbArrowsExchange2 } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

const CheckoutCustomization = () => {
	const location = useLocation();
	const { state: formData } = location;

	// Check if formData is available
	if (!formData) {
		return (
			<div className="text-center text-lg font-semibold">
				No data available. Please go back and select a product.
			</div>
		);
	}

	// Extract data from formData
	const {
		model,
		quantity,
		size,
		price,
		selectedBackrest,
		selectedSeat,
		selectedArmrest,
		selectedDesign,
		selectedWood,
		dimensions,
	} = formData;

	console.log("Form DAta: ", formData);

	// State for payment, delivery, and proof of payment
	const [paymentOption, setSelectedPaymentOption] = useState("Partial Payment");
	const [uploadMessage, setUploadMessage] = useState("");

	const [selectedDeliveryMode, setSelectedDeliveryMode] = useState("Delivery");
	const [proofOfPayment, setProofOfPayment] = useState(null);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
	const [paymentOptionVisible, setPaymentOptionVisible] = useState(false);
	const [user, setUser] = useState({}); // For storing fetched user data

	const handlePaymentMethodClick = (method, event) => {
		event.stopPropagation();
		setSelectedPaymentMethod(method);
	};

	const togglePaymentOptionVisibility = (event) => {
		event.stopPropagation();
		setPaymentOptionVisible((prev) => !prev);
	};
	// Prevent toggle from closing when clicking inside it
	const handleInnerClick = (event) => {
		event.stopPropagation();
	};

	const handleFileUpload = (event) => {
		event.stopPropagation();
		const file = event.target.files[0];
		setProofOfPayment(file);
		setUploadMessage(`Selected file: ${file.name}`);
	};

	

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch("http://localhost:3000/api/users/data", {
					method: "GET",
					credentials: "include",
				});
				if (!response.ok) {
					throw new Error("Failed to fetch user data");
				}
				const data = await response.json();
				setUser(data);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchUser();
	}, []);

	const createCustomizationOrder = async () => {
		try {
			const furnitureDetails = {
				model,
				quantity,
				size,
				price,
				selectedBackrest,
				selectedSeat,
				selectedArmrest,
				selectedDesign,
				selectedWood,
			};

			const orderData = {
				user,
				furnitureDetails,
				paymentMethod,
				paymentOption,
				proofOfPayment,
				deliveryMode,
			};

			console.log("Order Data:", orderData);

			// Uncomment the following lines to send data to the server
			// const response = await fetch("/api/orders", {
			// 	method: "POST",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// 	body: JSON.stringify(orderData),
			// });
			// if (!response.ok) throw new Error("Failed to create order");
		} catch (error) {
			console.error("Error creating order:", error);
		}
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
			<div className="space-y-6">
				{/* User Details */}
				<div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
					<h2 className="text-2xl font-semibold mb-4">User Details</h2>
					<p>
						{user.firstname} {user.lastname}
					</p>
					<p>{user.email}</p>
					<p>{user.phoneNumber}</p>
					<p>
						{user?.addresses?.filter((addr) => addr.isDefault)?.[0]
							?.streetAddress || "No default address found"}
					</p>
				</div>

				{/* Furniture Details */}
				<div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 flex">
					<div className="flex-1">
						<h2 className="text-2xl font-semibold mb-4">Furniture Details</h2>
						<p>
							<strong>Model:</strong> {model}
						</p>
						<p>
							<strong>Quantity:</strong> {quantity}
						</p>
						{model === "chair" && (
							<>
								<p>
									<strong>Backrest:</strong> {selectedBackrest}
								</p>
								<p>
									<strong>Seat:</strong> {selectedSeat}
								</p>
								<p>
									<strong>Wood:</strong> {selectedWood}
								</p>
							</>
						)}
						{model === "sofa" && (
							<>
								<p>
									<strong>Backrest:</strong> {selectedBackrest}
								</p>
								<p>
									<strong>Armrest:</strong> {selectedArmrest}
								</p>
								<p>
									<strong>Wood:</strong> {selectedWood}
								</p>
							</>
						)}
						{model === "door" && (
							<>
								<p>
									<strong>Design:</strong> {selectedDesign}
								</p>
								<p>
									<strong>Wood Type:</strong> {selectedWood}
								</p>
							</>
						)}

						{/* Dimensions */}
						<div className="mt-4">
						<h3 className="text-xl font-semibold">{formData.size?.name || "Size name not specified"}</h3>
						<h3 className="text-xl font-semibold">Dimensions</h3>
							<p>
								<strong>Height:</strong>{" "}
								{dimensions?.height || size?.height || "N/A"} inches
							</p>
							<p>
								<strong>Width:</strong>{" "}
								{dimensions?.width || size?.width || "N/A"} inches
							</p>
							<p>
								<strong>Depth:</strong>{" "}
								{dimensions?.depth || size?.depth || "N/A"} inches
							</p>
							<p>
								<strong>Length:</strong>{" "}
								{dimensions?.length || size?.length || "N/A"} inches
							</p>
							<p>
								<strong>Price:</strong> ₱{price}
							</p>
						</div>
					</div>
					<div className="flex-1 flex items-center justify-center">
						<img
							src={"placeholder-image.jpg"}
							alt={`${model} preview`}
							className="w-64 h-64 object-cover rounded-lg shadow"
						/>
					</div>
				</div>

				{/* Payment Options */}
				<div
					onClick={togglePaymentOptionVisibility}
					className="mt-5 rounded shadow-md p-2 border-t-2 border-teal-500  cursor-pointer"
				>
					<div>
						<h1 className="flex justify-between font-semibold text-lg">
							Payment Options
							<span className="text-2xl">
								{paymentOptionVisible ? <IoIosArrowUp /> : <IoIosArrowDown />}
							</span>
						</h1>
					</div>

					{/* Payment Options Content */}
					{paymentOptionVisible && (
						<div>
							{/* Payment Option Buttons */}
							<div className="flex justify-end gap-5 py-2">
								<span
									onClick={(event) => {
										event.stopPropagation();
										setSelectedPaymentOption("Partial Payment");
									}}
									className={`cursor-pointer border border-teal-600 p-2 rounded font-semibold transition ${
										paymentOption === "Partial Payment"
											? "text-white bg-teal-600 border-none"
											: "text-teal-500"
									}`}
								>
									Partial Payment
								</span>
								<span
									onClick={(event) => {
										event.stopPropagation();
										setSelectedPaymentOption("Full Payment");
									}}
									className={`cursor-pointer border border-teal-600 p-2 rounded font-semibold transition ${
										paymentOption === "Full Payment"
											? "text-white bg-teal-600 border-none"
											: "text-teal-500"
									}`}
								>
									Full Payment
								</span>
							</div>

							{/* Payment Descriptions */}
							{paymentOption === "Partial Payment" && (
								<div className="p-5 bg-gray-100 rounded mb-5">
									<strong>Partial Payment (3-Month Plan):</strong> Pay in
									installments with 50% down payment. Remaining balance can be
									paid over a minimum of 3 months. A 3% interest applies if
									payments are not made on time.
								</div>
							)}

							{paymentOption === "Full Payment" && (
								<div className="p-5 bg-gray-100 rounded mb-5">
									<strong>Full Payment:</strong> Pay the entire amount upfront
									with no additional charges.
								</div>
							)}
							{/* Payment Method */}
							<div className="mt-5">
								<h3 className="text-lg font-semibold mb-2">Payment Methods:</h3>
								{/* Display Selected Payment Method */}
								{selectedPaymentMethod && (
									<p className="mt-5 text-black">
										Selected Payment Method:{" "}
										<strong>{selectedPaymentMethod}</strong>
									</p>
								)}
							</div>
							{/* Payment Methods Selection */}
							<div className="flex justify-start text-center bg-gray-100 p-2 gap-5 rounded-md">
								{/* GCash Payment */}
								<button
									value="GCash"
									onClick={(event) => handlePaymentMethodClick("GCash", event)}
									className={`rounded relative p-2 transition-all duration-200 ${
										selectedPaymentMethod === "GCash"
											? "border-2 border-teal-600 bg-white shadow-lg transform scale-105"
											: "border border-gray-300 bg-slate-200 hover:border-teal-400"
									}`}
								>
									<img
										src="/payment-icon/gcash.png"
										alt="Gcash"
										className="w-20 h-20 object-contain rounded"
									/>
									{selectedPaymentMethod === "GCash" && (
										<div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
											<span className="text-white text-sm">✓</span>
										</div>
									)}
								</button>

								{/* Maya Payment */}
								<button
									value="Maya"
									onClick={(event) => handlePaymentMethodClick("Maya", event)}
									className={`rounded relative p-2 transition-all duration-200 ${
										selectedPaymentMethod === "Maya"
											? "border-2 border-teal-600 bg-white shadow-lg transform scale-105"
											: "border border-gray-300 bg-slate-200 hover:border-teal-400"
									}`}
								>
									<img
										src="/payment-icon/maya.jpg"
										alt="Maya"
										className="w-20 h-20 object-contain rounded"
									/>
									{selectedPaymentMethod === "Maya" && (
										<div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
											<span className="text-white text-sm">✓</span>
										</div>
									)}
								</button>
							</div>

							{selectedPaymentMethod === "Maya" ? (
								<div className="mt-5 bg-gray-100 p-5 rounded-md">
									<h1 className="text-xl font-semibold mb-2">
										Scan the QR Code
									</h1>
									<div className="flex flex-col lg:flex-row items-start gap-8">
										{/* QR Code */}
										<div className="flex border-2 border-teal-500 flex-col items-center">
											<img
												src="/payment-icon/Maya-qr.png"
												alt="QR Code"
												className="w-40 h-40 object-contain"
											/>
										</div>

										{/* Proof of Payment Upload */}
										<div className="flex-1 max-w-md pt-5">
											<h2 className="font-semibold text-teal-600 mb-4">
												Upload Proof of Payment
											</h2>
											<input
												type="file"
												onClick={handleInnerClick}
												onChange={handleFileUpload}
												className="mb-4 w-full border border-teal-500 rounded-md px-3 py-2 text-black focus:border-teal-600 focus:ring-teal-500"
											/>
											{uploadMessage && (
												<p className="text-teal-600 mt-2">{uploadMessage}</p>
											)}
										</div>
									</div>
								</div>
							) : (
								<div className="mt-5 bg-gray-100 p-5 rounded-md">
									<h1 className="text-xl font-semibold mb-2">
										Scan the QR Code
									</h1>
									<div className="flex flex-col lg:flex-row items-start gap-8">
										{/* QR Code */}
										<div className="flex border-2 border-teal-500 flex-col items-center">
											<img
												src="/payment-icon/GCash-qr.png"
												alt="QR Code"
												className="w-40 h-40 object-contain"
											/>
										</div>
										{/* Proof of Payment Upload */}
										<div className="flex-1 max-w-md pt-5">
											<h2 className="font-semibold text-teal-600 mb-4">
												Upload Proof of Payment
											</h2>
											<input
												type="file"
												onClick={handleInnerClick}
												onChange={handleFileUpload}
												className="mb-4 w-full border border-teal-500 rounded-md px-3 py-2 text-black focus:border-teal-600 focus:ring-teal-500"
											/>
											{uploadMessage && (
												<p className="text-teal-600 mt-2">{uploadMessage}</p>
											)}
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Delivery Option */}
				<div className="mt-5 border-t-2 border-teal-500 pt-5">
					<h1 className="font-semibold mb-4">Delivery Mode:</h1>
					<div className="flex justify-end gap-4">
						<button
							onClick={(event) => {
								event.stopPropagation();
								setSelectedDeliveryMode("Delivery");
							}}
							className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
								selectedDeliveryMode === "Delivery"
									? "bg-teal-600 text-white"
									: "border border-teal-600 text-teal-600 hover:bg-teal-50"
							}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Delivery
						</button>

						<button
							onClick={(event) => {
								event.stopPropagation();
								setSelectedDeliveryMode("Pick Up");
							}}
							className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
								selectedDeliveryMode === "Pick Up"
									? "bg-teal-600 text-white"
									: "border border-teal-600 text-teal-600 hover:bg-teal-50"
							}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
								/>
							</svg>
							Pick Up
						</button>
					</div>

					{/* Additional information based on selected mode */}
					{selectedDeliveryMode === "Delivery" && (
						<div className="mt-4 p-4 bg-slate-100 rounded-md">
							<p className="text-black font-semibold">
								Delivery fee will be calculated based on your location.
							</p>
						</div>
					)}

					{selectedDeliveryMode === "Pick Up" && (
						<div className="mt-4 p-4 bg-slate-100 rounded-md">
							<p className="text-gray-600">
								Pick up location: Our Store, Main Street
							</p>
							<p className="text-sm text-gray-500 mt-2">
								Available pick up time: Monday-Saturday, 9:00 AM - 6:00 PM
							</p>
						</div>
					)}
				</div>

				{/* Confirm Button */}
				<div className="text-center mt-6">
					<button
						onClick={createCustomizationOrder}
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					>
						Confirm and Create Order
					</button>
				</div>
			</div>
		</div>
	);
};

export default CheckoutCustomization;
