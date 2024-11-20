import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner"; // Assuming you have a loading spinner component
import { IoMdArrowRoundBack } from "react-icons/io";
import { TbArrowsExchange2 } from "react-icons/tb";

const PreOrder = () => {
	const { furnitureId } = useParams();
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [furnitureData, setFurnitureData] = useState(null);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [selectedColor, setSelectedColor] = useState(null);
	const [selectedMaterial, setSelectedMaterial] = useState(null);
	const [selectedSize, setSelectedSize] = useState(null);
	const [selectedDeliveryMode, setSelectedDeliveryMode] = useState("Delivery");
	const [quantity, setQuantity] = useState(1);
	const [shippingFee, setShippingFee] = useState(0);
	const [proofOfPayment, setProofOfPayment] = useState(null);
	const [uploadMessage, setUploadMessage] = useState("");
	const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [paymentOption, setSelectedPaymentOption] = useState("Partial Payment");
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [userInformationVisible, setUserInformationVisible] = useState(false);
	const [paymentOptionVisible, setPaymentOptionVisible] = useState(false);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
	const [price, setPrice] = useState(0);

	const shippingFees = {
		Boac: 500,
		Mogpog: 700,
		Gasan: 500,
		Buenavista: 800,
		Santa_Cruz: 3000,
		Torrijos: 3000,
	};
	const togglePaymentOptionVisibility = (event) => {
		event.stopPropagation();
		setPaymentOptionVisible((prev) => !prev);
	};

	// Prevent toggle from closing when clicking inside it
	const handleInnerClick = (event) => {
		event.stopPropagation();
	};

	useEffect(() => {
		if (user?.addresses?.length > 0 && selectedAddress) {
			const address = user.addresses.find(
				(address) => address._id === selectedAddress
			);
			const fee = shippingFees[address?.municipality] || 0;
			setShippingFee(fee);
		} else {
			setShippingFee(0);
		}
	}, [selectedAddress]);

	// Fetch furniture data and user data
	useEffect(() => {
		const fetchUser = async () => {
			setLoading(true);
			try {
				const response = await fetch("http://localhost:3000/api/users/data", {
					method: "GET",
					credentials: "include",
				});
				if (!response.ok) {
					throw new Error(response.message);
				}
				const user = await response.json();
				setUser(user);
				console.log(user);

				const defaultAddress = user.addresses?.find(
					(address) => address.isDefault
				);
				if (defaultAddress) {
					setSelectedAddress(defaultAddress._id);
				}

				console.log(defaultAddress);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		const fetchFurnitureDetails = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`http://localhost:3000/api/furnitures/${furnitureId}`,
					{
						method: "GET",
						credentials: "include",
					}
				);
				if (!response.ok) {
					throw new Error("Failed to fetch furniture details");
				}
				const newFurniture = await response.json();
				setFurnitureData(newFurniture);
				setExpectedDeliveryDate(newFurniture.furnitureType.ECT);
				console.log(newFurniture);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
		fetchFurnitureDetails();
	}, [furnitureId]);

	const totalAmount = price * quantity;

	const totalWithShipping =
		paymentOption === "Partial Payment"
			? (totalAmount / 2 + shippingFee).toFixed(2)
			: (totalAmount + shippingFee).toFixed(2);

	const partialPaymentAmount = (totalAmount / 2 + shippingFee).toFixed(2);

	const handlePaymentMethodClick = (method, event) => {
		event.stopPropagation();
		setSelectedPaymentMethod(method);
	};

	const handleColorClick = (color) => {
		setSelectedColor(color.name);
	};
	const handleMaterialClick = (material) => {
		setSelectedMaterial(material.name);
		setPrice(material.price);
	};

	// console.log(selectedMaterial);
	const handleSizeClick = (size) => {
		setSelectedSize(size.label);
	};

	useEffect(() => {
		if (furnitureData) {
			const startDeliveryDate = new Date();
			startDeliveryDate.setDate(
				startDeliveryDate.getDate() + furnitureData.furnitureType.ECT
			);

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
		}
	}, [furnitureData]); // Run this effect when furnitureData is available

	useEffect(() => {
		if (user?.addresses?.length > 0 && selectedAddress) {
			const address = user.addresses.find(
				(address) => address._id === selectedAddress
			);
			const fee = shippingFees[address?.municipality] || 0;
			setShippingFee(fee);
		} else {
			setShippingFee(0);
		}
	}, [selectedAddress, user]);

	const preOrder = async () => {
		if (!selectedColor || !selectedMaterial || !selectedSize) {
			toast.error(
				"Please select color, material and size before checking out."
			);
			return;
		}

		if (!selectedPaymentMethod) {
			toast.error("Please select payment method checking out.");
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
		// formData.append("furnitureId", JSON.stringify(furnitureData._id));
		formData.append("furnitureId", furnitureId);
		formData.append("color", selectedColor);
		formData.append("material", selectedMaterial);
		formData.append("size", selectedSize);
		formData.append("quantity", quantity);
		formData.append("paymentMethod", selectedPaymentMethod);
		formData.append("proofOfPayment", proofOfPayment);
		formData.append("paymentOption", paymentOption);
		formData.append("shippingAddress", JSON.stringify(addressToSend));
		formData.append("deliveryMode", selectedDeliveryMode);
		formData.append("expectedDelivery", expectedDeliveryDate);
		for (const [key, value] of formData.entries()) {
			console.log(`${key}:`, value);
		}
		try {
			const response = await fetch(
				"http://localhost:3000/api/orders/pre-order/create",
				{
					method: "POST",
					body: formData,
					credentials: "include",
				}
			);
			if (!response.ok) {
				throw new Error(response.message);
			}
			const data = await response.json();
			if (!data.ok) {
				toast.error(data.error);
			}
			const orderId = data.preOrder._id;
			navigate(`/order-details/${orderId}`);
		} catch (error) {
			setError(error.message);
			setLoading(false);
		}
	};

	const handleFileUpload = (event) => {
		event.stopPropagation(); // Prevent the click event from bubbling up
		const file = event.target.files[0];
		setProofOfPayment(file);
		setUploadMessage(`Selected file: ${file.name}`);
	};

	if (loading) {
		return <LoadingSpinner />;
	}
	if (error) {
		return <div className="text-red-500 text-center">{error}</div>;
	}
	if (!furnitureData) {
		return (
			<div className="text-gray-500 text-center">
				No furniture data available.
			</div>
		);
	}
	if (!user) {
		return (
			<div className="text-gray-500 text-center">No user data available.</div>
		);
	}

	return (
		<section className="bg-white">
			<Header isLogin={true} cartCount={true} />
			<div className="p-5 flex justify-center bg-slate-300 flex-col lg:flex-row gap-5">
				{/* Left Div for Images */}
				<div className="flex-1 lg:max-w-[600px] p-5 bg-slate-100">
					<button
						onClick={() => navigate(-1)}
						className="text-gray-500 mr-2 hover:text-teal-600"
					>
						<IoMdArrowRoundBack size={40} />
					</button>
					{/* Image Gallery Section */}
					<div className="mt-5">
						{furnitureData?.images && furnitureData.images.length > 0 && (
							<div className="flex flex-col items-center">
								<img
									src={`data:image/jpeg;base64,${furnitureData.images[currentImageIndex]}`}
									alt={furnitureData.name}
									className="w-full h-96 mx-auto object-contain"
								/>
								<div className="flex items-center justify-center space-x-4 mt-2">
									<button
										onClick={() =>
											setCurrentImageIndex((prev) =>
												prev === 0 ? furnitureData.images.length - 1 : prev - 1
											)
										}
									>
										<FaArrowLeftLong size={30} />
									</button>
									<div className="flex space-x-2 p-5">
										{furnitureData.images.map((image, index) => (
											<img
												key={index}
												src={`data:image/jpeg;base64,${image}`}
												alt={`Image ${index + 1} of ${furnitureData.name}`}
												className={`w-20 h-20 object-contain rounded cursor-pointer transition ${
													currentImageIndex === index
														? "border-blue-500"
														: "border-gray-300"
												}`}
												onClick={() => setCurrentImageIndex(index)}
											/>
										))}
									</div>
									<button
										onClick={() =>
											setCurrentImageIndex((prev) =>
												prev === furnitureData.images.length - 1 ? 0 : prev + 1
											)
										}
									>
										<FaArrowRightLong size={30} />
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
				{/* Right Div for Other Information */}
				<div className="flex-1 lg:max-w-[600px] p-5 bg-slate-100">
					<div className="flex flex-col items-center w-full h-full">
						<div className="flex flex-col justify-evenly w-full">
							<div className="flex flex-col justify-evenly w-full">
								<div className="flex flex-col justify-evenly w-full">
									{/* furniture information */}
									<div>
										<h1 className="text-3xl mb-2 py-5">{furnitureData.name}</h1>
										<p className="flex justify-between">
											<span>Estimated Completion Time: </span>
											<span>
												{furnitureData.furnitureType?.ECT || "N/A"} Days
											</span>
										</p>
									</div>

									{/* User Information Accordion */}
									<div className="mt-2 py-2 bg-slate-200">
										<div
											onClick={() =>
												setUserInformationVisible(!userInformationVisible)
											}
											className="cursor-pointer border-b-2 border-gray-400 text-black flex justify-between items-center mt-2"
										>
											<span className="font-semibold">User Information</span>
											<span className="text-2xl">
												{userInformationVisible ? "-" : "+"}
											</span>
										</div>
										{userInformationVisible && (
											<div className="bg-slate-200 p-2 flex flex-col gap-2">
												<h1 className="flex justify-between">
													Name:{" "}
													<span className="mr-2">
														{user.firstname} {user.lastname}
													</span>
												</h1>
												<h1 className="flex justify-between">
													Phone Number:{" "}
													<span className="mr-2">{user.phoneNumber}</span>
												</h1>
												<h1 className="flex justify-between">
													Email: <span className="mr-2">{user.email}</span>
												</h1>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Address Section Below */}
							<div className="text-base flex font-medium py-5 justify-between items-center">
								<h1>Delivery Address</h1>
								{user.addresses && user.addresses.length > 0 ? (
									user.addresses
										.filter((address) => address.isDefault)
										.map((defaultAddress, index) => (
											<p key={index} className="tracking-wide font-light p-2">
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
									className="text-teal-600 flex items-center font-semibold"
								>
									<TbArrowsExchange2 style={{ fontSize: "2rem" }} />
								</button>
							</div>

							{/* product details */}
							<div className="border border-teal-600 rounded-md p-5 flex flex-col gap-5">
								{/* Product Quantity */}
								<div className="flex justify-between border-b-2 border-gray-300">
									<label className="flex justify-between font-semibold mb-5">
										Quantity
									</label>
									<div className="flex items-center gap-2 mb-5">
										<button
											onClick={() =>
												setQuantity((prev) => Math.max(prev - 1, 1))
											}
											className="border border-teal-600 bg-white text-teal-600 px-3 py-1 rounded-l-md hover:bg-teal-600 hover:text-white transition"
										>
											-
										</button>
										<span className="border border-teal-600 text-teal-600 px-5 py-1">
											{quantity}
										</span>
										<button
											onClick={() =>
												setQuantity((prev) => Math.min(prev + 1))
											}
											className="border border-teal-600 bg-white text-teal-600 px-3 py-1 rounded-r-md hover:bg-teal-600 hover:text-white transition"
										>
											+
										</button>
									</div>
								</div>
								{/* Colors */}
								<div className="border-b-2 border-gray-300">
									<label className="flex justify-between font-semibold mb-5">
										Colors{" "}
										<span className="font-normal">
											{selectedColor || "Select color"}
										</span>
									</label>
									<div className="flex justify-end flex-wrap mb-5 gap-2">
										{furnitureData.colors?.map((color) => (
											<div
												key={color._id}
												onClick={() => handleColorClick(color)}
												className={`w-10 h-10 rounded-full border cursor-pointer relative flex items-center justify-center transition-transform transform hover:scale-110 ${
													selectedColor === color.name
														? "bg-teal-600 text-black"
														: "text-black"
												}`}
												style={{ backgroundColor: color.hex }}
											></div>
										))}
									</div>
								</div>
								{/* Materials */}
								<div className="border-b-2 border-gray-300">
									<h2 className="flex justify-between mb-5 font-semibold">
										Materials{" "}
										<span className="font-normal">
											{selectedMaterial || "Select material"}
										</span>
									</h2>
									<div className="flex justify-end space-x-2 mb-5 flex-wrap">
										{furnitureData.materials?.map((material) => (
											<span
												key={material.id}
												onClick={() => handleMaterialClick(material)}
												className={`border border-teal-600 hover:bg-teal-600 hover:text-white px-2 py-1 rounded-md cursor-pointer transition ${
													selectedMaterial === material.name
														? "bg-teal-600 text-white"
														: "text-teal-600"
												}`}
											>
												{material.name}
											</span>
										))}
									</div>
								</div>
								{/* Sizes */}
								<div>
									<h2 className="flex justify-between font-semibold mb-5">
										Sizes{" "}
										<span className="font-normal">
											{selectedSize || "Select size"}
										</span>
									</h2>
									<div className="flex justify-end space-x-2 flex-wrap">
										{furnitureData.sizes?.map((size) => (
											<span
												key={size.id}
												onClick={() => handleSizeClick(size)}
												className={`border px-2 py-1 rounded-md border-teal-600 hover:bg-teal-600 hover:text-white cursor-pointer transition ${
													selectedSize === size.label
														? "bg-teal-600 text-white"
														: "text-teal-600"
												}`}
											>
												{size.label}
											</span>
										))}
									</div>

									<div className="mt-5 border border-teal-600 p-5">
										<h1 className="font-semibold mb-2">Payment Details</h1>
										<div className="font-normal">
											<div className="flex justify-between">
												<span>Furniture Price (<i>based on material</i>):</span>
												<span>₱{price.toFixed(2)}</span>
											</div>
											<div className="flex justify-between">
												<span>Shipping Fee:</span>
												<span>₱{shippingFee.toFixed(2)}</span>
											</div>
											{/* payable amount dito */}
											<div className="mt-5">
												{paymentOption === "Partial Payment" ? (
													<div className="flex justify-between">
														<h3 className="text-lg font-semibold">
															Partial Payment (50%):
														</h3>
														<p className="font-bold">
															PHP {partialPaymentAmount}
														</p>
													</div>
												) : (
													<div className="flex justify-between">
														<h3 className="text-lg font-semibold">
															Total Payment:
														</h3>
														<p className="font-bold">PHP {totalWithShipping}</p>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* payment option */}
							<div
								onClick={togglePaymentOptionVisibility}
								className="mt-5 rounded shadow-md p-5"
							>
								<div>
									<h1 className="flex justify-between font-semibold">
										Payment Options{" "}
										<span className="text-2xl">
											{paymentOptionVisible ? " - " : " + "}
										</span>
									</h1>
									{paymentOptionVisible ? (
										<div>
											<div className="flex justify-end gap-5 py-5">
												<span
													onClick={(event) => {
														event.stopPropagation();
														setSelectedPaymentOption("Partial Payment");
													}}
													className={`cursor-pointer border border-teal-600 p-2 rounded font-semibold ${
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
													className={`cursor-pointer border border-teal-600 p-2 rounded font-semibold ${
														paymentOption === "Full Payment"
															? "text-white bg-teal-600 border-none"
															: "text-teal-500"
													}`}
												>
													Full Payment
												</span>
											</div>

											{paymentOption === "Partial Payment" && (
												<div className="p-5 bg-slate-200 mb-5">
													<strong>Partial Payment (3-Month Plan)</strong> Pay in installments
													with 50% down payment and remaining balance can be
													paid over a minimum of 3 months. 3% Interest applies
													only if payments are not made on time.
												</div>
											)}

											{paymentOption === "Full Payment" && (
												<div className="p-5 bg-slate-200 mb-5">
													<strong>Full Payment Pay</strong> the entire amount upfront with no
													additional charges.
												</div>
											)}

											{/* Payment method */}
											<div>
												<h3 className="text-lg font-semibold mb-2">
													Payment Methods:
												</h3>
												<div className="flex justify-end text-center bg-slate-200 p-5 gap-5">
													{/* Gcash payment */}
													<button
														value="GCash"
														onClick={(event) =>
															handlePaymentMethodClick("GCash", event)
														}
														className={`rounded relative p-2 transition-all duration-200 ${
															selectedPaymentMethod === "GCash"
																? "border-2 border-teal-600 bg-white shadow-lg transform scale-105"
																: "border border-gray-300 bg-slate-200 hover:border-teal-400"
														}`}
													>
														<img
															src="/payment-icon/gcash.png"
															alt="gcash"
															className="w-20 h-20 object-contain rounded"
														/>
														{selectedPaymentMethod === "GCash" && (
															<div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
																<span className="text-white text-sm">✓</span>
															</div>
														)}
													</button>
													{/* Maya payment */}
													<button
														value="Maya"
														onClick={(event) =>
															handlePaymentMethodClick("Maya", event)
														}
														className={`rounded relative p-2 transition-all duration-200 ${
															selectedPaymentMethod === "Maya"
																? "border-2 border-teal-600 bg-white shadow-lg transform scale-105"
																: "border border-gray-300 bg-slate-200 hover:border-teal-400"
														}`}
													>
														<img
															src="/payment-icon/maya.jpg"
															alt="maya"
															className="w-20 h-20 object-contain rounded"
														/>
														{selectedPaymentMethod === "Maya" && (
															<div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
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
											<div className="mt-5 bg-slate-200 p-5">
												<h1 className="text-xl font-semibold mb-2">
													Scan the QR Code
												</h1>
												<div className="flex items-start gap-8">
													{/* QR Code Section */}
													<div className="flex flex-col items-center">
														<img
															src="/payment-icon/qrcode.png"
															alt="qrcode"
															className="w-40 h-40 object-contain"
														/>
													</div>
													{/* Image Upload Section */}
													<div className="flex-1 max-w-md pt-5">
														<h2 className="font-semibold text-teal-600 mb-4">
															Upload Proof of Payment
														</h2>
														<input
															type="file"
															onClick={handleInnerClick}
															onChange={handleFileUpload}
															className="mb-4 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600 focus:border-teal-600 focus:ring-teal-500"
														/>
														{uploadMessage && <p>{uploadMessage}</p>}
													</div>
												</div>
											</div>
										</div>
									) : (
										!paymentOptionVisible
									)}
								</div>
							</div>

							{/* Delivery Option */}
							<div className="mt-5 border-t-2 border-gray-300 pt-5">
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
										<p className="text-gray-600">
											Delivery fee will be calculated based on your location.
										</p>
										<p className="text-sm text-gray-500 mt-2">
											Estimated delivery time: {expectedDeliveryDate || "N/A"}
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

							{/* order details */}
							<div className="mt-5">
								<h1>Order details</h1>
							</div>

							<div className="mt-4 flex gap-4">
								<button
									onClick={preOrder}
									disabled={loading}
									className="text-teal-500 hover:bg-teal-500 hover:text-white border border-teal-500 text-xl font-semibold px-4 rounded-md transition-colors duration-300 flex-1 py-2"
								>
									{loading ? "Creating Pre-Order...." : "Pre-Order"}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ToastContainer />
			<Footer />
		</section>
	);
};

export default PreOrder;
