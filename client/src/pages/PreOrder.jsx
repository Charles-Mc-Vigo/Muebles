import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner"; // Assuming you have a loading spinner component
import { IoMdArrowRoundBack } from "react-icons/io";

const PreOrder = () => {
	const { furnitureId } = useParams();
	const navigate = useNavigate();
	const [user, setUser] = useState({ addresses: [] });
	const [furnitureData, setFurnitureData] = useState(null);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [shippingFee, setShippingFee] = useState(0);
	const [proofOfPayment, setProofOfPayment] = useState(null);
	const [uploadMessage, setUploadMessage] = useState("");
	const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [paymentOption, setSelectedPaymentOption] = useState("Partial Payment");
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const shippingFees = {
		Boac: 500,
		Mogpog: 700,
		Gasan: 500,
		Buenavista: 800,
		Santa_Cruz: 3000,
		Torrijos: 3000,
	};

	// Fetch user data
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
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, []);

	// Fetch furniture data
	useEffect(() => {
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
				const data = await response.json();
				setFurnitureData(data);
				console.log(data);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};
		fetchFurnitureDetails();
	}, [furnitureId]);

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
		formData.append("shippingAddress", JSON.stringify(addressToSend));
		formData.append("expectedDelivery", expectedDeliveryDate);

		for (const [key, value] of formData.entries()) {
			console.log(`${key}:`, value);
		}
		// try {
		//     const response = await fetch("http://localhost:3000/api/orders/create", {
		//         method: "POST",
		//         body: formData,
		//         credentials: "include",
		//     });
		//     if (!response.ok) {
		//         throw new Error(response.message);
		//     }
		//     const data = await response.json();
		//     if (!data.ok) {
		//         toast.error(data.error);
		//     }
		//     const orderId = data.order._id;
		//     navigate(`/order-details/${orderId}`);
		// } catch (error) {
		//     setError(error.message);
		//     setLoading(false);
		// }
	};

	const handleFileUpload = (event) => {
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
					<div className="flex flex-col p-5 items-center h-full w-full">
						<div className="flex flex-col p-5 justify-evenly w-full h-full">
							<div className="mt-2">
								{/* <h1>{furnitureData.name}</h1> */}
								<p className="border-b-2 py-2 border-gray-400">
									Estimated Completion Time: {expectedDeliveryDate || "N/A"}
								</p>
							</div>
							<div className="mb-4 rounded-md p-2">
								<label className="block font-semibold">
									Selected Address: {selectedAddress || "None"}
								</label>
								<div className="flex flex-wrap gap-2">
									{user.addresses.map((address) => (
										<div
											key={address._id}
											onClick={() => setSelectedAddress(address._id)}
											className={`border p-2 rounded cursor-pointer ${
												selectedAddress === address._id
													? "bg-teal-600 text-white"
													: "text-black"
											}`}
										>
											{address.streetAddress}, {address.municipality}
										</div>
									))}
								</div>
							</div>
							<div className="mt-4">
								<h2 className="text-lg font-semibold">Payment Options</h2>
								<div className="flex space-x-2 flex-wrap">
									<label>
										<input
											type="radio"
											value="Partial Payment"
											checked={paymentOption === "Partial Payment"}
											onChange={() =>
												setSelectedPaymentOption("Partial Payment")
											}
										/>
										Partial Payment
									</label>
									<label>
										<input
											type="radio"
											value="Full Payment"
											checked={paymentOption === "Full Payment"}
											onChange={() => setSelectedPaymentOption("Full Payment")}
										/>
										Full Payment
									</label>
								</div>
							</div>
							<div className="mt-4">
								<h2 className="text-lg font-semibold">
									Upload Proof of Payment
								</h2>
								<input
									type="file"
									onChange={handleFileUpload}
									className="mb-4 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600 focus:border-teal-600 focus:ring-teal-500"
								/>
								{uploadMessage && <p>{uploadMessage}</p>}
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
