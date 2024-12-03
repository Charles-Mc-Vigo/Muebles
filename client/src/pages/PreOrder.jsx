import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { IoMdArrowRoundBack } from "react-icons/io";
import { TbArrowsExchange2 } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

const PreOrder = () => {
	const { furnitureId } = useParams();
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [furnitureData, setFurnitureData] = useState(null);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [selectedColor, setSelectedColor] = useState(null);
	const [selectedMaterial, setSelectedMaterial] = useState(null);
	const [selectedSize, setSelectedSize] = useState(null);
	const [materialPrice, setMaterialPrice] = useState(null);
	const [sizePrice, setSizePrice] = useState(null);
	const [selectedDeliveryMode, setSelectedDeliveryMode] = useState("Delivery");
	const [quantity, setQuantity] = useState(1);
	const [totalAmount, setTotalAmount] = useState(0);
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
	const [productDescriptionVisible, setProductDescriptionVisible] =
		useState(false);
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
				console.log(newFurniture.price);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
		fetchFurnitureDetails();
	}, [furnitureId]);

	const subtotal = (materialPrice || 0) + (sizePrice || 0);
	const totalAmountWithShippingFee = (
		subtotal * quantity +
		shippingFee
	).toFixed(2);

	// For partial payment
	const partialPayment = (
		(subtotal * quantity + shippingFee) /
		2
	).toFixed(2);

	const remainingBalance = (
		subtotal * quantity +
		shippingFee -
		partialPayment
	).toFixed(2);

	const montlyInstallment = (remainingBalance / 3).toFixed(2);

	useEffect(() => {
		// Calculate total amount based on price, quantity, and any other relevant factors
		if (price && quantity) {
			const calculatedTotalAmount = price * quantity;
			setTotalAmount(calculatedTotalAmount);
		}
	}, [price, quantity]);

	const handlePaymentMethodClick = (method, event) => {
		event.stopPropagation();
		setSelectedPaymentMethod(method);
	};

	const handleColorClick = (color) => {
		setSelectedColor(color.name);
	};

	const handleMaterialClick = (material) => {
		setSelectedMaterial(material.name);
		setMaterialPrice(material.price);
		setPrice(material.price + (sizePrice || 0));
	};

	const handleSizeClick = (size) => {
		setSelectedSize(size.label);
		setSizePrice(size.price);
		setPrice((materialPrice || 0) + size.price);
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
		formData.append("subtotal", subtotal);
		formData.append("totalAmount", totalAmount);
		formData.append("shippingFee", shippingFee);
		formData.append("totalAmountWithShippingFee", totalAmountWithShippingFee);
		formData.append("partialPayment", partialPayment);
		formData.append("remainingBalance", remainingBalance);
		formData.append("montlyInstallment", montlyInstallment);
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
		event.stopPropagation();
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
			<div className="flex flex-col lg:flex-row lg:w-full justify-center p-5 gap-5">
				{/* Image Section */}
				<div className="flex flex-col rounded-xl p-5 border-2 border-teal-600 shadow-lg shadow-gray-300 sm:mb-5 md:mb-5 w-full md:w-1/2 lg:w-1/4 h-[70vh]">
					{/* Back Button */}
					<button
						onClick={() => navigate(-1)}
						className="text-gray-500 hover:text-teal-600 self-start mb-3"
					>
						<IoMdArrowRoundBack size={30} />
					</button>

					{/* Image and Controls */}
					<div className="flex flex-col items-center mt-2 h-full">
						{furnitureData?.images && furnitureData.images.length > 0 && (
							<div className="flex flex-col items-center h-full">
								{/* Main Image */}
								<img
									src={`data:image/jpeg;base64,${furnitureData.images[currentImageIndex]}`}
									alt={furnitureData.name}
									className="w-full h-3/4 object-contain rounded"
								/>

								{/* Controls */}
								<div className="flex items-center justify-center space-x-4 mt-2">
									{/* Previous Button */}
									<button
										onClick={() =>
											setCurrentImageIndex((prev) =>
												prev === 0 ? furnitureData.images.length - 1 : prev - 1
											)
										}
										className="text-gray-500 hover:text-teal-600"
									>
										<FaArrowLeftLong size={30} />
									</button>

									{/* Thumbnails */}
									<div className="flex space-x-2 overflow-x-auto p-2">
										{furnitureData.images.map((image, index) => (
											<img
												key={index}
												src={`data:image/jpeg;base64,${image}`}
												alt={`Thumbnail ${index + 1}`}
												className={`w-16 h-16 object-contain rounded cursor-pointer transition ${
													currentImageIndex === index
														? "border-2 border-teal-600"
														: "border border-gray-300"
												}`}
												onClick={() => setCurrentImageIndex(index)}
											/>
										))}
									</div>

									{/* Next Button */}
									<button
										onClick={() =>
											setCurrentImageIndex((prev) =>
												prev === furnitureData.images.length - 1 ? 0 : prev + 1
											)
										}
										className="text-gray-500 hover:text-teal-600"
									>
										<FaArrowRightLong size={30} />
									</button>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* 2nd Div */}
				<div className="flex flex-col  rounded-xl p-5 border-2 border-teal-600 shadow-lg shadow-gray-300 w-full max-w-3/4 md:w-1/2 lg:w-1/4 min-h-[300px]">
					<div className="">
						<h1 className="text-2xl font-bold mb-2 ml-2 ">
							{furnitureData.name}
						</h1>
						<p className="flex justify-between ml-2">
							<span className="text-lg font-normal">
								Estimated Completion Time:{" "}
							</span>
							<span className="text-lg">
								{furnitureData.furnitureType?.ECT || "N/A"} Days
							</span>
						</p>
					</div>
					<div className=" p-2">
						{/* product description */}
						<div>
							<div
								onClick={() =>
									setProductDescriptionVisible(!productDescriptionVisible)
								}
								className="cursor-pointer text-black flex justify-between items-center mt-2"
							>
								<span className="font-semibold">Product Description</span>
								<span className="text-2xl">
									{productDescriptionVisible ? (
										<IoIosArrowUp />
									) : (
										<IoIosArrowDown />
									)}
								</span>
							</div>
							{productDescriptionVisible && (
								<div className="mt-2 p-2 text-black">
									<p>
										{furnitureData.description || "No description available."}
									</p>
								</div>
							)}
						</div>
						<div className="mt-2 py-2 ">
							<div
								onClick={() =>
									setUserInformationVisible(!userInformationVisible)
								}
								className="cursor-pointer text-black flex justify-between items-center mt-2"
							>
								<span className="font-semibold">User Information</span>
								<span className="text-2xl">
									{userInformationVisible ? (
										<IoIosArrowUp />
									) : (
										<IoIosArrowDown />
									)}
								</span>
							</div>
							{/* User Information Accordion */}
							{userInformationVisible && (
								<div className="bg-gray-200 p-2 flex flex-col gap-2 text-black">
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
						{/* Address Section Below */}
						<div className="text-base flex font-medium py-5 justify-between items-center border-t-2 border-teal-500">
							<h1>Delivery Address</h1>
							{user.addresses && user.addresses.length > 0 ? (
								user.addresses
									.filter((address) => address.isDefault)
									.map((defaultAddress, index) => (
										<p key={index} className="tracking-wide font-light p-2">
											{defaultAddress.streetAddress}, {defaultAddress.barangay},{" "}
											{defaultAddress.municipality}, {defaultAddress.zipCode}
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
						{/* Buy Products */}
						<div className="flex justify-between border-b-2 border-teal-500">
							<label className="flex justify-between font-semibold mb-5">
								Quantity
							</label>
							<div className="flex items-center gap-2 mb-5">
								<button
									onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
									className="border border-teal-600 bg-white text-teal-600 px-3 py-1 rounded-l-md hover:bg-teal-600 hover:text-white transition"
								>
									-
								</button>
								<span className="border border-teal-600 text-teal-600 px-5 py-1">
									{quantity}
								</span>
								<button
									onClick={() => setQuantity((prev) => Math.min(prev + 1))}
									className="border border-teal-600 bg-white text-teal-600 px-3 py-1 rounded-r-md hover:bg-teal-600 hover:text-white transition"
								>
									+
								</button>
							</div>
						</div>

						{/* Colors Section */}
						<div className="">
							<label className="flex justify-between font-semibold mb-5">
								Colors{" "}
								<span className="font-normal">
									{selectedColor || "Select color"}
								</span>
							</label>
							<div className="flex justify-end flex-wrap mb-5 gap-2 ">
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

							{/* Materials Section */}
							<div className="border-b-2 border-teal-500">
								<h2 className="flex justify-between mb-5 font-semibold">
									Materials{" "}
									<span className="font-normal">
										{selectedMaterial || "Select material"}
									</span>
								</h2>
								<div className="flex flex-col-1 text-xl space-x-2 mb-5 flex-wrap">
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

							{/* Sizes Section */}
							<div className="flex flex-col">
								<h2 className="flex  justify-between font-semibold mb-2">
									Sizes{" "}
									<span className="font-normal">
										{selectedSize || "Select size"}
									</span>
								</h2>
								<div className="flex text-lg flex-col-2 gap-2 mb-2">
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
							</div>
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
									<h3 className="text-lg font-semibold mb-2">
										Payment Methods:
									</h3>
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
					{/* calculation payment */}
					<div className="mt-5 border border-teal-600 p-5">
						<h1 className="font-semibold mb-2">Payment Details</h1>
						<div className="font-normal">
							<div className="flex justify-between">
								<span>Material Price:</span>
								<span>₱ {materialPrice || 0}</span>
							</div>
							<div className="flex justify-between">
								<span>Size Price :</span>
								<span>₱ {sizePrice || 0}</span>
							</div>
							<div className="flex justify-between">
								<span>Subtotal :</span>
								<span>₱ {subtotal || 0}</span>
							</div>
							<div className="flex justify-between mt-5">
								<span>Shipping Fee:</span>
								<span>₱ {shippingFee.toFixed(2)}</span>
							</div>
							<div className="flex justify-between">
								<span>Total Amount :</span>
								<span>₱ {totalAmountWithShippingFee || 0}</span>
							</div>
							{/* payable amount dito */}
							<div className="mt-5">
								{paymentOption === "Partial Payment" ? (
									<div>
										<div className="flex justify-between">
											<h3 className="font-semibold">
												Partial Payment (50%):
											</h3>
											<p>₱ {partialPayment}</p>
										</div>
										<div className="flex justify-between">
											<h3 className="font-semibold">
												Remaining Balance:
											</h3>
											<p>₱ {remainingBalance || 0}</p>
										</div>
										<div className="flex justify-between">
											<h3 className="font-semibold">
												Monthly Installment for 3 months:
											</h3>
											<p>₱ {montlyInstallment || 0}</p>
										</div>
									</div>
								) : (
									<div className="flex justify-between">
										<h3 className="text-lg font-semibold">Total Payment:</h3>
										<p className="font-bold">
											PHP {totalAmountWithShippingFee}
										</p>
									</div>
								)}
							</div>
						</div>
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
								<p className="text-base text-black mt-2">
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
			<ToastContainer />
			<Footer />
		</section>
	);
};
export default PreOrder;
