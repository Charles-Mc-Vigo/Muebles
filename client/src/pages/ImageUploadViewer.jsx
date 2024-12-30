import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ImageUploadViewer = () => {
	const { orderId } = useParams();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [expandedImage, setExpandedImage] = useState(null);
	const [paymentOption, setPaymentOption] = useState("");
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
	const [proofOfPayment, setProofOfPayment] = useState(null);
	const [referenceNumber, setReferenceNumber] = useState(""); // Added state for reference number
	const [payment, setPayment] = useState(""); // Added state for total amount

	const navigate = useNavigate()

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/orders/uploaded-images-orders/${orderId}`,
					{
						method: "GET",
						credentials: "include",
					}
				);
				if (!response.ok) {
					throw new Error("Failed to fetch order details");
				}
				const data = await response.json();
				setOrder(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchOrder();
	}, [orderId]);

	const handleImageClick = (image) => setExpandedImage(image);

	const closeExpandedImage = () => setExpandedImage(null);

	const handlePaymentMethodClick = (method) => setSelectedPaymentMethod(method);

	const handleFileUpload = (e) => setProofOfPayment(e.target.files[0]);

	const handlePaymentSubmission = async () => {
		if (
			!proofOfPayment ||
			!paymentOption ||
			!selectedPaymentMethod ||
			!referenceNumber ||
			!payment
		) {
			alert("Please complete all payment details.");
			return;
		}

		// Ensure the payment matches the order's total amount
		if (parseFloat(payment) !== parseFloat(order.totalAmount)) {
			alert("Payment does not match the order total.");
			return;
		}

		try {
			const formData = new FormData();
			// Append the form fields to FormData
			formData.append("proofOfPayment", proofOfPayment); // File upload (proof of payment)
			formData.append("paymentOption", paymentOption); // Partial or Full payment
			formData.append("paymentMethod", selectedPaymentMethod); // Selected payment method (e.g., GCash, Maya)
			formData.append("referenceNumber", referenceNumber); // Reference number input
			formData.append("payment", payment); // Total amount input

			// Send the form data in a POST request
			const response = await fetch(
				`http://localhost:3000/api/orders/uploaded-images-orders/continue/${orderId}`, // Replace with your correct API endpoint
				{
					method: "POST",
					credentials: "include",
					body: formData,
				}
			);

			// Check for successful response
			if (!response.ok) throw new Error("Payment upload failed.");
			alert("Payment uploaded successfully!");

			// Clear the form data by resetting the state values
			setPaymentOption(""); // Reset payment option
			setSelectedPaymentMethod(""); // Reset payment method
			setProofOfPayment(null); // Clear uploaded proof of payment
			setReferenceNumber(""); // Reset reference number
			setPayment(""); // Reset total amount input

			navigate('/orders')
		} catch (err) {
			alert(err.message); // Handle error
		}
	};

	if (loading)
		return (
			<p className="text-gray-600 text-center">Loading order details...</p>
		);
	if (error) return <p className="text-red-500 text-center">Error: {error}</p>;
	if (!order)
		return <p className="text-gray-600 text-center">Order not found.</p>;

	return (
		<div className="container mx-auto p-8 space-y-8">
			{expandedImage && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
					<img
						src={`data:image/jpeg;base64,${expandedImage}`}
						alt="Expanded Design"
						className="max-w-full max-h-full rounded shadow-lg"
					/>
					<button
						onClick={closeExpandedImage}
						className="absolute top-4 right-4 text-white text-3xl font-bold"
					>
						&times;
					</button>
				</div>
			)}

			{/* Order Details */}
			<div className="bg-white rounded-lg shadow-md p-8 space-y-6">
				<h1 className="text-4xl font-bold text-gray-800">Order Details</h1>
				<h2 className="text-2xl font-semibold text-gray-700">
					Order #{order.orderNumber}
				</h2>
				<div className="text-gray-700 space-y-2">
					<p>
						<strong>Customer: </strong>
						{order.user?.firstname} {order.user?.lastname}
					</p>
					<p>
						<strong>Email: </strong>
						{order.user?.email}
					</p>
					<p>
						<strong>Phone: </strong>
						{order.user?.phoneNumber}
					</p>
					<p>
						<strong>Total Payment: </strong>
						{order.totalAmount}
					</p>
				</div>
			</div>

			{/* Uploaded Designs */}
			<div className="bg-white rounded-lg shadow-md p-8">
				<h3 className="text-2xl font-semibold text-gray-800 mb-4">
					Uploaded Designs
				</h3>
				{order.designImages?.length > 0 ? (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{order.designImages.map((image, index) => (
							<div
								key={index}
								className="rounded-lg overflow-hidden shadow-lg bg-gray-50 cursor-pointer"
								onClick={() => handleImageClick(image)}
							>
								<img
									src={`data:image/jpeg;base64,${image}`}
									alt={`Design ${index + 1}`}
									className="w-full h-40 object-cover hover:scale-105 transition"
								/>
							</div>
						))}
					</div>
				) : (
					<p className="text-gray-600">No designs uploaded</p>
				)}
			</div>

			{/* Payment Section */}
			<div className="bg-white rounded-lg shadow-md p-8 space-y-6">
				<h1 className="text-2xl font-bold text-gray-800">Payment Section</h1>

				{/* Payment Option Dropdown */}
				<label className="block text-gray-700 font-medium">
					Select Payment Option
				</label>
				<select
					className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					value={paymentOption}
					onChange={(e) => setPaymentOption(e.target.value)}
				>
					<option value="">-- Select Payment Option --</option>
					<option value="Partial Payment">Partial Payment</option>
					<option value="Full Payment">Full Payment</option>
				</select>

				{/* Payment Method Selection */}
				{paymentOption && (
					<div className="flex justify-center text-center bg-slate-200 p-5 gap-8">
						{["GCash", "Maya"].map((method) => {
							const imgSrcPng = `/payment-icon/${method.toLowerCase()}.png`;
							const imgSrcJpg = `/payment-icon/${method.toLowerCase()}.jpg`;

							return (
								<button
									key={method}
									onClick={() => setSelectedPaymentMethod(method)}
									className={`rounded p-2 transition-all duration-200 ${
										selectedPaymentMethod === method
											? "border-2 border-green-600 bg-white shadow-lg transform scale-105"
											: "border border-gray-300 bg-slate-200 hover:border-green-400"
									}`}
								>
									<img
										src={imgSrcPng}
										onError={({ currentTarget }) => {
											// Fallback to JPG if PNG is not found
											currentTarget.onerror = null;
											currentTarget.src = imgSrcJpg;
										}}
										alt={method}
										className="w-20 h-20 object-contain rounded"
									/>
								</button>
							);
						})}
					</div>
				)}

				{/* Display QR Code */}
				{selectedPaymentMethod && (
					<div className="flex justify-center mt-4">
						<div className="bg-white p-6 rounded-lg shadow-md text-center">
							<h3 className="text-xl font-semibold text-gray-800 mb-2">
								{selectedPaymentMethod} QR Code
							</h3>
							<img
								src={`/payment-icon/${selectedPaymentMethod}-qr.png`}
								alt={`${selectedPaymentMethod} QR Code`}
								className="w-40 h-40 object-contain mx-auto"
							/>
						</div>
					</div>
				)}

				{selectedPaymentMethod && (
					<div className="mt-6">
						<label className="block text-gray-700 font-medium">
							Upload Proof of Payment
						</label>
						<input
							type="file"
							accept="image/*"
							className="w-full p-2 border rounded-lg"
							onChange={handleFileUpload}
						/>
						{proofOfPayment && (
							<p className="mt-2 text-green-600 font-medium">
								File Uploaded: {proofOfPayment.name}
							</p>
						)}
					</div>
				)}

				{/* Reference Number Input */}
				{selectedPaymentMethod && (
					<div className="mt-6">
						<label className="block text-gray-700 font-medium">
							Reference Number
						</label>
						<input
							type="text"
							className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter Reference Number"
							onChange={(e) => setReferenceNumber(e.target.value)} // Updated state
						/>
					</div>
				)}

				{/* Total Amount Input */}
				{selectedPaymentMethod && (
					<div className="mt-6">
						<div className="p-5 bg-slate-200">
							<p>
								Total Amount : {order.totalAmount || "Not set"}
							</p>
						</div>
						<label className="block text-gray-700 font-medium">
							Please pay the exact amount
						</label>
						<input
							type="number"
							className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter Total Amount"
							onChange={(e) => setPayment(e.target.value)} // Updated state
						/>
					</div>
				)}

				{/* Submission Button */}
				<button
					className="mt-6 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
					onClick={handlePaymentSubmission}
				>
					Submit Payment
				</button>
			</div>
		</div>
	);
};

export default ImageUploadViewer;
