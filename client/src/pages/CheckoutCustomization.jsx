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

	// Extract data from formData
	const {
		model,
		quantity,
		size,
		selectedBackrest,
		selectedSeat,
		selectedArmrest,
		selectedDesign,
		selectedWood,
		selectedWoodType,
		dimensions,
		imageUrl,
	} = formData;

	// State for payment, delivery, and proof of payment
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
	const [user, setUser] = useState({}); // For storing fetched user data

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

	const handlePaymentOptionChange = (event) => setPaymentOption(event.target.value);
	const handlePaymentMethodChange = (event) => setPaymentMethod(event.target.value);
	const handleProofOfPaymentChange = (event) => setProofOfPayment(event.target.files[0]);
	const handleDeliveryModeChange = (event) => setDeliveryMode(event.target.value);

	const createCustomizationOrder = async () => {
		try {
			const furnitureDetails = {
				model,
				quantity,
				selectedBackrest,
				selectedSeat,
				selectedArmrest,
				selectedDesign,
				selectedWood,
				selectedWoodType,
			};

			const orderData = {
				user,
				furnitureDetails,
				size,
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
					<p>{user.firstname} {user.lastname}</p>
					<p>{user.email}</p>
					<p>{user.phoneNumber}</p>
					<p>
						{user?.addresses?.filter(addr => addr.isDefault)?.[0]?.streetAddress || "No default address found"}
					</p>
				</div>

				{/* Furniture Details */}
				<div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 flex">
					<div className="flex-1">
						<h2 className="text-2xl font-semibold mb-4">Furniture Details</h2>
						<p><strong>Model:</strong> {model}</p>
						<p><strong>Quantity:</strong> {quantity}</p>
						{model === "chair" && (
							<>
								<p><strong>Backrest:</strong> {selectedBackrest}</p>
								<p><strong>Seat:</strong> {selectedSeat}</p>
								<p><strong>Wood:</strong> {selectedWood}</p>
							</>
						)}
						{model === "sofa" && (
							<>
								<p><strong>Backrest:</strong> {selectedBackrest}</p>
								<p><strong>Armrest:</strong> {selectedArmrest}</p>
								<p><strong>Wood:</strong> {selectedWood}</p>
							</>
						)}
						{model === "door" && (
							<>
								<p><strong>Design:</strong> {selectedDesign}</p>
								<p><strong>Wood Type:</strong> {selectedWoodType}</p>
							</>
						)}

						{/* Dimensions */}
						<div className="mt-4">
							<h3 className="text-xl font-semibold">Dimensions</h3>
							<p><strong>Height:</strong> {dimensions?.height || size?.height || "N/A"} inches</p>
							<p><strong>Width:</strong> {dimensions?.width || size?.width || "N/A"} inches</p>
							<p><strong>Depth:</strong> {dimensions?.depth || size?.depth || "N/A"} inches</p>
							<p><strong>Length:</strong> {dimensions?.length || size?.length || "N/A"} inches</p>
						</div>
					</div>
					<div className="flex-1 flex items-center justify-center">
						<img
							src={imageUrl || "placeholder-image.jpg"}
							alt={`${model} preview`}
							className="w-64 h-64 object-cover rounded-lg shadow"
						/>
					</div>
				</div>

				{/* Payment Options */}
				<div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
					<h3 className="text-xl font-semibold mb-4">Payment Options</h3>
					<div>
						<label htmlFor="paymentOption" className="block">Payment Option</label>
						<select id="paymentOption" value={paymentOption} onChange={handlePaymentOptionChange} className="w-full mt-2">
							<option value="Full Payment">Full Payment</option>
							<option value="Partial Payment">Partial Payment</option>
						</select>
					</div>
					<div>
						<label htmlFor="paymentMethod" className="block mt-4">Payment Method</label>
						<select id="paymentMethod" value={paymentMethod} onChange={handlePaymentMethodChange} className="w-full mt-2">
							<option value="GCash">GCash</option>
							<option value="Maya">Maya</option>
						</select>
					</div>
					{["GCash", "Maya"].includes(paymentMethod) && (
						<div className="mt-4">
							<label htmlFor="proofOfPayment">Upload Proof of Payment</label>
							<input type="file" id="proofOfPayment" onChange={handleProofOfPaymentChange} className="w-full mt-2" />
						</div>
					)}
				</div>

				{/* Delivery Mode */}
				<div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
					<h3 className="text-xl font-semibold">Delivery Mode</h3>
					<select id="deliveryMode" value={deliveryMode} onChange={handleDeliveryModeChange} className="w-full mt-2">
						<option value="Pick">Pick</option>
						<option value="Delivery">Delivery</option>
					</select>
				</div>

				{/* Confirm Button */}
				<div className="text-center mt-6">
					<button onClick={createCustomizationOrder} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
						Confirm and Create Order
					</button>
				</div>
			</div>
		</div>
	);
};

export default CheckoutCustomization;
