import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import { IoMdArrowRoundBack } from "react-icons/io";
import Header from "../components/Header";
import Footer from "../components/Footer";

function PreOrder() {
	const { furnitureId } = useParams();
	const navigate = useNavigate();
	const [furnitureData, setFurnitureData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectedColor, setSelectedColor] = useState(null);
	const [selectedMaterial, setSelectedMaterial] = useState(null);
	const [selectedSize, setSelectedSize] = useState(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};
		fetchFurnitureDetails();
	}, [furnitureId]);

	const handleThumbnailClick = (index) => {
		setCurrentImageIndex(index);
	};

	const handlePreviousImage = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === 0 ? furnitureData.images.length - 1 : prevIndex - 1
		);
	};

	const handleNextImage = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === furnitureData.images.length - 1 ? 0 : prevIndex + 1
		);
	};

	const createPreOrder = async () => {
		setLoading(true);
		if (!selectedColor || !selectedMaterial || !selectedSize) {
			toast.error("Please select color, material, and size.");
			setLoading(false);
			return;
		}

		const preOrderData = {
			furnitureId,
			color: selectedColor,
			material: selectedMaterial,
			size: selectedSize,
		};

		try {
			const response = await fetch(
				"http://localhost:3000/api/orders/pre-order/create",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(preOrderData),
				}
			);
			const data = await response.json();
			if (!data.ok) {
				toast.error(data.error);
			} else {
				toast.success(data.success);
				navigate("/success"); // Redirect to a success page or another appropriate page
			}
			console.log(preOrderData);
		} catch (error) {
			console.error("Error creating pre-order:", error);
			toast.error("Error creating pre-order. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (error) return <div className="text-red-500 text-center">{error}</div>;
	if (!furnitureData)
		return <div className="text-center">No furniture found</div>;

	return (
		<>
			{loading ? (
				<LoadingSpinner />
			) : (
				<div className="flex flex-col">
					<Header isLogin={true} cartCount={true} />
					<div className="mx-auto bg-slate-400 h-screen justify-center">
						<div className="mx-auto p-5 flex flex-col lg:flex-row bg-red-300 h-screen">
							<div className="flex flex-col lg:w-[800px] p-5 bg-blue-300 rounded-xl shadow-xl shadow-gray-300 relative">
								<button
									onClick={() => navigate(-1)}
									className="text-gray-500 mr-2 hover:text-teal-600"
								>
									<IoMdArrowRoundBack size={40} />
								</button>
								<div className="flex-grow flex flex-col items-center p-4">
									<div className="flex-grow flex items-center justify-center">
										{furnitureData.images &&
											furnitureData.images.length > 0 && (
												<img
													src={`data:image/jpeg;base64,${furnitureData.images[currentImageIndex]}`}
													alt={furnitureData.name}
													className="w-3/4 h-full object-contain"
												/>
											)}
									</div>
									<div className="flex items-center justify-center space-x-4">
										<button onClick={handlePreviousImage}>
											<FaArrowLeft size={30} />
										</button>
										<div className="flex space-x-2">
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
													onClick={() => handleThumbnailClick(index)}
												/>
											))}
										</div>
										<button onClick={handleNextImage}>
											<FaArrowRight size={30} />
										</button>
									</div>
								</div>
							</div>
							<div className="flex-1 lg:max-w-[400px] p-5 bg-white border-gray-300 rounded-lg shadow-lg ml-0 lg:ml-5">
								<h1 className="text-3xl font-bold">{furnitureData.name}</h1>
								<div className="mt-2">
									<h2 className="text-lg font-semibold">Price</h2>
									<p className="border-b-2 border-gray-400">
										₱ {furnitureData.price}
									</p>
								</div>
								<div className="mb-4 rounded-md p-2">
									<label className="block font-semibold">
										Colors: {selectedColor || "None"}
									</label>
									<div className="flex flex-wrap gap-2">
										{furnitureData.colors?.map((color) => (
											<div
												key={color._id}
												onClick={() => setSelectedColor(color.name)}
												className={`w-16 h-16 rounded-full border cursor-pointer relative flex items-center justify-center transition-transform transform hover:scale-110 ${
													selectedColor === color.name
														? "bg-teal-600 text-black"
														: "text-black"
												}`}
												style={{ backgroundColor: color.hex }}
											></div>
										))}
									</div>
								</div>
								<div className="mt-4">
									<h2 className="text-lg font-semibold">Materials</h2>
									<div className="flex space-x-2 flex-wrap">
										{furnitureData.materials?.map((material) => (
											<span
												key={material.id}
												onClick={() => setSelectedMaterial(material.name)}
												className={`border border-black px-2 py-1 rounded-md cursor-pointer transition ${
													selectedMaterial === material.name
														? "bg-teal-600 text-black"
														: "text-black"
												}`}
											>
												{material.name}
											</span>
										))}
									</div>
								</div>
								<div className="mt-4">
									<h2 className="text-lg font-semibold">Sizes</h2>
									<div className="flex space-x-2 flex-wrap">
										{furnitureData.sizes?.map((size) => (
											<span
												key={size.id}
												onClick={() => setSelectedSize(size.label)}
												className={`border px-2 py-1 rounded-md cursor-pointer transition ${
													selectedSize === size.label
														? "bg-teal-600 text-black"
														: "text-black"
												}`}
											>
												{size.label}
											</span>
										))}
									</div>
								</div>
								<div>{/* user information */}</div>
								<div>{/* payment */}</div>
								<div>{/* payment method (gcash or maya) */}</div>
								<div>{/* expected delivery */}</div>
								<div className="mt-4 flex gap-4">
									<button
										onClick={createPreOrder}
										disabled={loading}
										className="text-teal-500 hover:bg-teal-500 hover:text-white border border-teal-500 text-xl font-semibold px-4 rounded-md transition-colors duration-300 flex-1 py-2"
									>
										{loading ? "Creating..." : "Create Pre-Order"}
									</button>
								</div>
							</div>
						</div>
						<ToastContainer />
					</div>
					<Footer />
				</div>
			)}
		</>
	);
}

export default PreOrder;
