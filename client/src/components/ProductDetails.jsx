import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	FaChevronUp,
	FaChevronDown,
	FaArrowRight,
	FaArrowLeft,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Footer from "./Footer";
import { IoChevronBackSharp } from "react-icons/io5";

function ProductDetails({ admin }) {
	const { id } = useParams();
	const navigate = useNavigate();
	const [furnitureData, setFurnitureData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [selectedColor, setSelectedColor] = useState(null);
	const [selectedMaterial, setSelectedMaterial] = useState(null);
	const [selectedSize, setSelectedSize] = useState(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	useEffect(() => {
		setLoading(true);
		const fetchFurnitureDetails = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/furnitures/${id}`,
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
	}, [id]);

	const handleColorClick = (color) => {
		setSelectedColor(color.name);
		setSelectedMaterial(null);
		setSelectedSize(null);
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
	const addToCart = async (e) => {
		e.preventDefault();
		setLoading(true);
		// Ensure all options are selected
		if (!selectedColor || !selectedMaterial || !selectedSize) {
			toast.error("Please select color, material, and size.");
			return;
		}

		const item = {
			furnitureId: id,
			quantity: 1,
			color: selectedColor,
			material: selectedMaterial,
			size: selectedSize,
		};

		try {
			const response = await fetch("http://localhost:3000/api/cart", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(item),
			});

			const data = await response.json();

			if (!data.ok) {
				toast.error(data.error);
			}

			toast.success(data.success);
		} catch (error) {
			console.error("Error adding item to cart:", error);
			toast.error("Error adding item to cart. Please try again.");
		}
		setLoading(false);
	};

	if (error) return <div className="text-red-500 text-center">{error}</div>;
	if (!furnitureData)
		return <div className="text-center">No furniture found</div>;

	const FAQAccordion = ({ question, answer }) => {
		const [isOpen, setIsOpen] = useState(false);
		const toggleAccordion = () => {
			setIsOpen(!isOpen);
		};

		return (
			<div className="border-b border-gray-300">
				<button
					onClick={toggleAccordion}
					className="flex justify-between items-center w-full py-4 text-left focus:outline-none overflow-hidden"
				>
					<h3 className="text-lg font-medium text-gray-800">{question}</h3>
					<span className="text-lg text-gray-600">
						{isOpen ? <FaChevronUp /> : <FaChevronDown />}
					</span>
				</button>
				{isOpen && (
					<div className="py-4 text-gray-700 text-md">
						<ul className="list-none pl-5">
							{answer.map((item, index) => (
								<li key={index} className="my-2">
									{item}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		);
	};

	const faqItems = [
		{ question: "Description?", answer: [furnitureData.description] },
		{
			question: "Specification",
			answer: [
				"This furniture can be crafted from premium woods such as mahogany, acacia, and narra, and is available in a variety of color finishes to suit different tastes and interiors.",
			],
		},
		{ question: "Warranty", answer: ["None"] },
		{
			question: "How do I care for wooden furniture?",
			answer: [
				"1.Wooden Furniture Care Guide",
				"2.Clean Gently",
				"3.Avoid Direct Sunlight",
				"4.Use Protective Surfaces",
				"5.Polish Occasionally",
				"6. Control Humidity",
			],
		},
	];

	return (
		<section className="bg-white">
			<Header isLogin={true} cartCount={true}/>
			{/* Right side Image */}
			<div className="container mx-auto p-5 flex flex-col lg:flex-row">
				<div className="flex flex-col lg:flex-row lg:w-full justify-center mt-10">
					<div className="flex flex-col lg:w-[800px] lg:h-[800px] p-2 bg-white rounded-xl shadow-xl shadow-gray-300 relative">
						<button
							onClick={() => navigate(-1)}
							className="text-teal-600 hover:text-teal-900 mb-4 lg:mb-0 lg:mr-5"
						>
							<IoChevronBackSharp size={50} />
						</button>
						<div className="flex-grow flex flex-col items-center p-4 ">
							<div className="flex-grow flex items-center justify-center ">
								{furnitureData.images && furnitureData.images.length > 0 && (
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
					{/* Product details */}
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
										onClick={() => handleColorClick(color)}
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
										onClick={() => handleMaterialClick(material)}
										className={`border border-black px-2 py-1 rounded-md  cursor-pointer transition ${
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
										onClick={() => handleSizeClick(size)}
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
						<div className="mt-4 text-justify text-base">
							{/* Ensure the FAQ container is flexible */}
							{faqItems.map((item, index) => (
								<FAQAccordion
									key={index}
									question={item.question}
									answer={item.answer}
								/>
							))}
						</div>
						<div className="mt-4 flex gap-4">
							<button
								onClick={addToCart}
								disabled={loading}
								className="text-teal-500 hover:bg-teal-500 hover:text-white border border-teal-500 text-xl font-semibold px-4 rounded-md transition-colors duration-300 flex-1 py-2"
							>
								{loading ? "Adding...":"Add to cart"}
							</button>

						</div>
					</div>
				</div>
			</div>

			{/* Advertisement Section */}
			<div
				className="w-full mb-5 max-w-[1829px] p-10 mt-5 rounded-lg shadow-lg mx-auto"
				style={{ backgroundColor: "#ecede4" }}
			>
				<h2 className="text-2xl font-bold mb-4 text-center">
					Sustainable Furniture for a Greener Tomorrow
				</h2>
				<p className="text-lg text-gray-700 mb-6 text-justify">
					Transform your house with furniture designed with nature in mind. Our
					items are composed of carefully sourced materials and built to last,
					reducing waste while promoting sustainability. For every tree we use,
					we give back a hundredfold to reforestation efforts, ensuring a
					greener future. From the warmth of natural wood to the long-lasting
					durability of eco-friendly paints, our furniture combines style and
					environmental responsibility. Join us in making a positive
					contribution by designing a beautiful home while protecting nature for
					future generations.
				</p>
				<p className="text-base font-bold text-center text-teal-600">JCKAME</p>
				<p className="text-sm text-center text-gray-500">
					Founded in Marinduque, 2003
				</p>
			</div>

			<div
				className="w-full h-full mb-5 max-w-[1829px] max-h-[500px] p-10 mt-5 rounded-lg shadow-lg mx-auto"
				style={{ backgroundColor: "#ecede4" }}
			></div>
			<ToastContainer />
			<Footer />
		</section>
	);
}

export default ProductDetails;
