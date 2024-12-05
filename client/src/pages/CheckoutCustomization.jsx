import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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

	const { model, quantity, size } = formData;
	console.log("Form Data :", formData);

	// State for payment option, method, delivery mode, and proof of payment
	const [paymentOption, setPaymentOption] = useState(
		formData.paymentOption || "Full Payment"
	);
	const [paymentMethod, setPaymentMethod] = useState(
		formData.paymentMethod || "GCash"
	);
	const [proofOfPayment, setProofOfPayment] = useState(
		formData.proofOfPayment || ""
	);
	const [deliveryMode, setDeliveryMode] = useState(
		formData.deliveryMode || "Delivery"
	);
	const [user, setUser] = useState("");

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
				setUser(data); // Store the user data in the state
				console.log(data);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchUser();
	}, []);

	const handlePaymentOptionChange = (event) => {
		setPaymentOption(event.target.value);
	};

	const handlePaymentMethodChange = (event) => {
		setPaymentMethod(event.target.value);
	};

	const handleProofOfPaymentChange = (event) => {
		setProofOfPayment(event.target.files[0]); // Store the file
	};

	const handleDeliveryModeChange = (event) => {
		setDeliveryMode(event.target.value);
	};

	// Function to handle order creation using fetch
	const createCustomizationOrder = async () => {
		try {
			const furnitureDetails = {
				model,
				quantity,
				selectedBackrest: formData.selectedBackrest,
				selectedSeat: formData.selectedSeat,
				selectedDesign: formData.selectedDesign,
				selectedWoodType: formData.selectedWoodType,
			};
	
			// Conditionally add selectedArmrest if the model is not a chair
			if (model !== "chair") {
				furnitureDetails.selectedDesign = formData.selectedDesign;
			}
	
			const orderData = {
				user: user,
				furnitureDetails,
				size,
				paymentMethod,
				paymentOption,
				proofOfPayment,
				deliveryMode,
			};
	
			// Uncomment the following lines to make the API call
			// const response = await fetch("/api/orders", {
			// 	method: "POST",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// 	body: JSON.stringify(orderData),
			// });
			// if (!response.ok) {
			// 	throw new Error("Failed to create order");
			// }
			// const responseData = await response.json();
			console.log("Order created successfully:", orderData);
		} catch (error) {
			console.error("Error creating order:", error);
		}
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold text-center mb-8"></h1>
			<div className="space-y-6">
				<div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
					<div className="space-y-2">
						<h2 className="text-2xl font-semibold mb-4">User Details</h2>
						<p>
							{user.firstname} {user.lastname}
						</p>
						<p>{user.email}</p>
						<p>{user.phoneNumber}</p>
						<p>
							{user?.addresses
								?.filter((address) => address.isDefault)
								?.map((address, index) => (
									<span key={index}>
										{address.streetAddress}, {address.barangay},{" "}
										{address.municipality}, {address.zipCode}
									</span>
								)) || "No default address"}
						</p>
					</div>
				</div>

				{/* Custom Size */}
				<div className="bg-white p-6 shadow-lg rounded-lg border flex border-gray-200">
					<div className="space-y-2 flex-1 flex flex-col">
						<h2 className="text-2xl font-semibold mb-4">Furniture Details</h2>
						<p>
							<strong>Model:</strong>{" "}
							{model.charAt(0).toUpperCase() + model.slice(1)}
						</p>
						<p>
							<strong>Quantity:</strong> {quantity}
						</p>
						{model === "chair" && (
							<>
								<p>
									<strong>Backrest:</strong> {formData.selectedBackrest}
								</p>
								<p>
									<strong>Seat:</strong> {formData.selectedSeat}
								</p>
								<p>
									<strong>Wood Type:</strong> {formData.selectedWood}
								</p>
							</>
						)}
						{model === "sofa" && (
							<>
								<p>
									<strong>Sofa Backrest:</strong> {formData.selectedBackrest}
								</p>
								<p>
									<strong>Sofa Armrest:</strong> {formData.selectedArmrest}
								</p>
								<p>
									<strong>Wood Type:</strong> {formData.selectedWood}
								</p>
							</>
						)}
						{model === "door" && (
							<>
								<p>
									<strong>Door Design:</strong> {formData.selectedDesign}
								</p>
								<p>
									<strong>Wood Type:</strong> {formData.selectedWoodType}
								</p>
							</>
						)}
						<div className="space-y-2">
							<h2 className="text-xl font-semibold mb-4">Size</h2>
							<p>
								<strong>Name:</strong> {size?.name || "Not specified"}
							</p>
							<p>
								<strong>Height:</strong> {size.height || size.dimensions?.height} inches
							</p>
							<p>
								<strong>Length:</strong> {size.length || size.dimensions?.length} inches
							</p>
							<p>
								<strong>Width:</strong> {size.width || size.dimensions?.width} inches
							</p>
							<p>
								<strong>Depth:</strong> {size.depth || size.dimensions?.depth} inches
							</p>
						</div>
					</div>

					{/* Add image container here to be added later */}
					<div className="mt-4 flex flex-1 items-center text-center bg-slate-300">
						<img
							src={formData.imageUrl || "placeholder-image.jpg"}
							alt={`${model} preview`}
							className="w-full h-64 object-cover rounded-lg shadow-sm"
						/>
					</div>
				</div>

				{/* Payment Options */}
				<div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
					<div className="space-y-4">
						<div>
							<label
								htmlFor="paymentOption"
								className="block text-lg font-semibold"
							>
								Payment Option
							</label>
							<select
								id="paymentOption"
								value={paymentOption}
								onChange={handlePaymentOptionChange}
								className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="Full Payment">Full Payment</option>
								<option value="Partial Payment">Partial Payment</option>
							</select>
						</div>

						<div>
							<label
								htmlFor="paymentMethod"
								className="block text-lg font-semibold"
							>
								Payment Method
							</label>
							<select
								id="paymentMethod"
								value={paymentMethod}
								onChange={handlePaymentMethodChange}
								className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="GCash">GCash</option>
								<option value="Maya">Maya</option>
							</select>
						</div>

						{["GCash", "Maya"].includes(paymentMethod) && (
							<div>
								<label
									htmlFor="proofOfPayment"
									className="block text-lg font-semibold"
								>
									Proof of Payment
								</label>
								<div className="mt-2">
									<img
										src="https://via.placeholder.com/150"
										alt="Example QR Code"
										className="mb-2"
									/>
									<input
										type="file"
										id="proofOfPayment"
										onChange={handleProofOfPaymentChange}
										className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Delivery Mode */}
				<div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
					<h3 className="text-xl font-semibold mb-4">Delivery Mode</h3>
					<div>
						<label
							htmlFor="deliveryMode"
							className="block text-lg font-semibold"
						>
							Delivery Mode
						</label>
						<select
							id="deliveryMode"
							value={deliveryMode}
							onChange={handleDeliveryModeChange}
							className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="Pick">Pick</option>
							<option value="Delivery">Delivery</option>
						</select>
					</div>
				</div>

				{/* Confirm Button */}
				<div className="mt-6 text-center">
					<button
						onClick={createCustomizationOrder}
						className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
					>
						Confirm and Create Order
					</button>
				</div>
			</div>
		</div>
	);
};

export default CheckoutCustomization;
