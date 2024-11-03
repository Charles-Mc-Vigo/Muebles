import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DirectOrder() {
	const navigate = useNavigate();
	const { furnitureId } = useParams();
	const [furnitureData, setFurnitureData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedColor, setSelectedColor] = useState(null);
	const [selectedMaterial, setSelectedMaterial] = useState(null);
	const [selectedSize, setSelectedSize] = useState(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("COD"); // Default payment method
	const [selectedAddress, setSelectedAddress] = useState(null);

	useEffect(() => {
		fetchUserAddresses();
	}, []);

	useEffect(() => {
		const fetchFurnitureDetails = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/furnitures/${furnitureId}`,
					{
						method: "GET",
						credentials: "include",
					}
				);
				const data = await response.json();
				if (!data.ok) {
					toast.error(data.error);
				}
				setFurnitureData(data);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};
		fetchFurnitureDetails();
	}, [furnitureId]);

	const placeOrder = async (e) => {
		e.preventDefault();

		// Ensure all options are selected
		if (!selectedColor || !selectedMaterial || !selectedSize) {
			toast.error("Please select color, material, and size.");
			return;
		}

		const item = {
			furnitureId: furnitureId,
			quantity: 1,
			color: selectedColor,
			material: selectedMaterial,
			size: selectedSize,
		};

		try {
			const response = await fetch(
				`http://localhost:3000/api/orders/direct-order/${furnitureId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(item),
				}
			);

			const data = await response.json();

			if (!data.ok) {
				toast.error(data.error);
			}

			toast.success(data.success);
		} catch (error) {
			console.error("Error adding item to cart:", error);
			toast.error("Error adding item to cart. Please try again.");
		}
	};

	const handleColorClick = (color) => {
		setSelectedColor(color.name);
	};

	const handleMaterialClick = (material) => {
		setSelectedMaterial(material.name);
	};

	const handleSizeClick = (size) => {
		setSelectedSize(size.label);
	};

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

	if (loading) return <div className="text-center">Loading...</div>;
	if (error) return <div className="text-red-500 text-center">{error}</div>;
	if (!furnitureData)
		return <div className="text-center">No furniture found</div>;

	return (
		<section className="bg-gray-50">
			<div className="container mx-auto p-5 flex flex-col lg:flex-row">
				<div className="flex flex-col lg:flex-row lg:w-full justify-center mt-10">
					<div className="flex flex-col lg:w-[800px] lg:h-[800px] p-5 border-2 border-gray-300 bg-white rounded-lg shadow-md relative">
						<button
							onClick={() => navigate(-1)}
							className="text-gray-500 mb-4 lg:mb-0 lg:mr-5"
						>
							<FaLongArrowAltLeft size={30} />
						</button>
						<div className="flex-grow flex flex-col items-center p-4">
							<div className="flex-grow flex items-center justify-center mb-4">
								{furnitureData.images && furnitureData.images.length > 0 && (
									<img
										src={`data:image/jpeg;base64,${furnitureData.images[currentImageIndex]}`}
										alt={furnitureData.name}
										className="w-3/4 h-full object-contain"
									/>
								)}
							</div>
							<div className="flex items-center justify-center mt-4 space-x-4">
								<button onClick={handlePreviousImage}>
									<FaLongArrowAltLeft size={30} />
								</button>
								<div className="flex space-x-2">
									{furnitureData.images.map((image, index) => (
										<img
											key={index}
											src={`data:image/jpeg;base64,${image}`}
											alt={`Image ${index + 1} of ${furnitureData.name}`}
											className={`w-20 h-20 object-contain border-2 rounded cursor-pointer transition ${
												currentImageIndex === index
													? "border-blue-500"
													: "border-gray-300"
											}`}
											onClick={() => handleThumbnailClick(index)}
										/>
									))}
								</div>
								<button onClick={handleNextImage}>
									<FaLongArrowAltRight size={30} />
								</button>
							</div>
						</div>
					</div>
					<div className="flex-1 lg:max-w-[400px] lg:h-[800px] p-5 bg-white border-2 border-gray-300 rounded-lg shadow-md ml-0 lg:ml-5 flex flex-col justify-between">
						<div>
							<h1 className="text-3xl font-bold">{furnitureData.name}</h1>
							<div className="flex justify-between">
								<h3 className="text-lg font-semibold">Price</h3>
								<p>₱ {furnitureData.price}</p>
							</div>
							<div className="flex justify-between">
								<h3 className="text-lg font-semibold">Stocks</h3>
								<p>{furnitureData.stocks}</p>
							</div>
							<div className="flex justify-between">
								<h3 className="text-lg font-semibold">Description</h3>
								<p>{furnitureData.description}</p>
							</div>
							<div>
								<label className="block font-semibold">
									Colors: {selectedColor || "None"}
								</label>
								<div className="flex flex-wrap gap-2">
									{furnitureData.colors?.map((color) => (
										<div
											key={color._id}
											onClick={() => handleColorClick(color)}
											className={`w-16 h-16 rounded-full border cursor-pointer relative flex items-center justify-center transition-transform transform hover:scale-110 ${
												selectedColor === color.name
													? "border-blue-600"
													: "border-gray-400"
											}`}
											style={{ backgroundColor: color.hex }}
										></div>
									))}
								</div>
							</div>
							<div>
								<h2 className="text-lg font-semibold">Materials</h2>
								<div className="flex space-x-2 flex-wrap">
									{furnitureData.materials?.map((material) => (
										<span
											key={material.id}
											onClick={() => handleMaterialClick(material)}
											className={`border px-2 py-1 rounded-md cursor-pointer transition ${
												selectedMaterial === material.name
													? "bg-blue-600 text-white"
													: "text-gray-800"
											}`}
										>
											{material.name}
										</span>
									))}
								</div>
							</div>
							<div>
								<h2 className="text-lg font-semibold">Sizes</h2>
								<div className="flex space-x-2 flex-wrap">
									{furnitureData.sizes?.map((size) => (
										<span
											key={size.id}
											onClick={() => handleSizeClick(size)}
											className={`border px-2 py-1 rounded-md cursor-pointer transition ${
												selectedSize === size.label
													? "bg-blue-600 text-white"
													: "text-gray-800"
											}`}
										>
											{size.label}
										</span>
									))}
								</div>
							</div>
							<div>
								<h2 className="text-lg font-semibold">Payment Method</h2>
								<select
									value={selectedPaymentMethod}
									onChange={(e) => setSelectedPaymentMethod(e.target.value)}
									className="border px-2 py-1 rounded-md"
								>
									<option value="COD">Cash on Delivery</option>
									<option value="GCash">GCash</option>
									<option value="Maya">Maya</option>
								</select>
							</div>

							<div>
								<h2 className="text-lg font-semibold">Shipping Address</h2>
								<select
									value={selectedAddress?._id || ""}
									onChange={(e) =>
										setSelectedAddress(
											addresses.find(
												(address) => address._id === e.target.value
											)
										)
									}
									className="border px-2 py-1 rounded-md"
								>
									<option value="">Select Address</option>
									{addresses.map((address) => (
										<option key={address._id} value={address._id}>
											{`${address.streetAddress}, ${address.barangay}, ${address.municipality}`}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="mt-4">
							<button
								onClick={placeOrder}
								className="bg-blue-500 hover:bg-blue-700 text-white px-4 rounded-md transition-colors duration-300 w-full py-4"
							>
								Place Order
							</button>
						</div>
					</div>
				</div>
			</div>
			<ToastContainer />
		</section>
	);
}

export default DirectOrder;
