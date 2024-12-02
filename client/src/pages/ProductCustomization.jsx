import React, { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Chair } from "../Models/ChairModels";
import { Sofa } from "../Models/DesignSofa";
import { Door } from "../Models/DesignDoor";
import { useFrame } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";

const RotatingObject = ({ children }) => {
	const groupRef = useRef();

	useFrame(() => {
		if (groupRef.current) {
			groupRef.current.rotation.y += 0.0;
		}
	});

	return <group ref={groupRef}>{children}</group>;
};

const chairMaterials = {
	Narra: {
		name: "Narra",
		price: 9000,
	},
	Mahogany: {
		name: "Mahogany",
		price: 3000,
	},
	Acacia: {
		name: "Acacia",
		price: 3000,
	},
};

const chairSizes = {
	Standard: {
		name: "Standard",
		dimensions: {
			height: 35,
			width: 21,
			depth: 18,
			length: 0,
		},
	},
};

const ProductCustomization = () => {
	const navigate = useNavigate();
	const canvasRef = useRef(null); // Reference for the canvas

	// State for selected model
	const [selectedModel, setSelectedModel] = useState("chair");
	// for chair
	const [selectedBackrest, setSelectedBackrest] = useState("");
	const [selectedSeat, setSelectedSeat] = useState("");
	const [selectedWood, setSelectedWood] = useState("");

	// for door
	const [selectedDoorDesign, setselectedDoorDesign] = useState("");
	const [selectedDoorWoodType, setSelectedDoorWoodType] = useState("");

	// for sofa
	const [selectedSofaBackrest, setSelectedSofaBackrest] = useState("");
	const [selectedSofaArmrest, setSelectedSofaArmrest] = useState("");
	const [selectedSofaWood, setSelectedSofaWood] = useState("");
	const [quantity, setQuantity] = useState(1); // Initial quantity set to 1
	const [selectedSize, setSelectedSize] = useState(null);
	const [isCustomSizeVisible, setCustomSizeVisible] = useState(false);

	const toggleCustomSize = () => {
		setCustomSizeVisible((prev) => !prev);
	};

	const [customSize, setCustomSize] = useState({
		height: "",
		length: "",
		width: "",
		depth: "",
	});

	// Handle increase/decrease
	const handleQuantityChange = (change) => {
		setQuantity((prevQuantity) => {
			const newQuantity = prevQuantity + change;
			return newQuantity > 0 ? newQuantity : 1; // Prevent negative quantity
		});
	};

	// Handlers for each part selection
	const handleBackrestChange = (design) => {
		if (selectedModel === "chair") setSelectedBackrest(design);
	};
	const handleSeatChange = (design) => {
		if (selectedModel === "chair") setSelectedSeat(design);
	};

	const handleWoodChange = (e) => {
		if (selectedModel === "chair") setSelectedWood(e.target.value);
	};

	// handle backrest of sofa
	const handleSofaBackrest = (design) => {
		if (selectedModel === "sofa") setSelectedSofaBackrest(design);
	};
	const handleSofaArmrest = (design) => {
		if (selectedModel === "sofa") setSelectedSofaArmrest(design);
	};

	const handleSofaWoodChange = (e) => {
		if (selectedModel === "sofa") setSelectedSofaWood(e.target.value);
	};

	// for door
	const handleDoorDesignChange = (design) => {
		if (selectedModel === "door") setselectedDoorDesign(design);
	};

	const handleDoorWoodChange = (e) => {
		if (selectedModel === "door") setSelectedDoorWoodType(e.target.value);
	};
	// console.log(selectedWood);
	// Reset customization when model changes
	useEffect(() => {
		// Reset all states based on the selected model
		if (selectedModel === "chair") {
			setSelectedBackrest("");
			setSelectedSeat("");
			setSelectedWood("");
		} else if (selectedModel === "sofa") {
			setSelectedSofaBackrest("");
			setSelectedSofaArmrest("");
			setSelectedSofaWood("");
		} else if (selectedModel === "door") {
			setselectedDoorDesign("");
			setSelectedDoorWoodType("");
		}
	}, [selectedModel]);

	const handleSubmit = async () => {
		if (!selectedModel) {
			alert("Please select a piece of furniture to checkout.");
			return;
		}

		// Prepare the formData based on the selected model
		let formData;

		if (selectedModel === "chair") {
			formData = {
				model: "chair",
				selectedBackrest: selectedBackrest,
				selectedSeat: selectedSeat,
				selectedWood: selectedWood,
				quantity,
				size: selectedSize || customSize,
			};
		} else if (selectedModel === "sofa") {
			formData = {
				model: "sofa",
				selectedSofaBackrest: selectedSofaBackrest,
				selectedSofaArmrest: selectedSofaArmrest,
				selectedSofaWood: selectedSofaWood,
				quantity,
				size: selectedSize || customSize,
			};
		} else if (selectedModel === "door") {
			formData = {
				model: "door",
				selectedDoorDesign: selectedDoorDesign,
				selectedDoorWoodType: selectedDoorWoodType,
				quantity,
				size: selectedSize || customSize,
			};
		}

		console.log("FormData: ", formData);
		navigate("/customize-product/checkout", { state: formData });
	};

	return (
		<div className="flex flex-col h-screen">
			<Header isLogin={true} />
			<div className="flex-grow flex flex-col md:flex-row bg-gray-100 p-4">
				{/* Canvas for the 3D model */}
				<div className="flex-grow md:w-2/3 flex items-center justify-center">
					<Canvas ref={canvasRef}>
						{/* <ambientLight intensity={0.5} />
						<directionalLight position={[10, 10, 10]} /> */}
						<ambientLight intensity={0.7} color="#ffffff" />

						{/* Directional Light: Add strong directional lighting */}
						<directionalLight
							position={[5, 10, 5]}
							intensity={1.2}
							castShadow
						/>

						{/* Optional: Add Point Light for localized illumination */}
						<pointLight position={[0, 5, 0]} intensity={0.8} color="#ffd700" />
						{/* Conditionally render models */}
						{selectedModel === "chair" && (
							<RotatingObject>
								<Chair
									selectedBackrest={selectedBackrest}
									selectedSeat={selectedSeat}
									selectedWood={selectedWood}
								/>
							</RotatingObject>
						)}
						{selectedModel === "door" && (
							<RotatingObject>
								<Door
									selectedDoorDesign={selectedDoorDesign}
									selectedDoorWoodType={selectedDoorWoodType}
								/>
							</RotatingObject>
						)}
						{selectedModel === "sofa" && (
							<RotatingObject>
								<Sofa
									selectedBackrest={selectedSofaBackrest}
									selectedArmrest={selectedSofaArmrest}
									selectedSofaWood={selectedSofaWood}
								/>
							</RotatingObject>
						)}
						<OrbitControls minDistance={2} maxDistance={10} />

						{/* commented for now kase ano. ayaw ko na eh */}
						{/* enableZoom={false} */}
					</Canvas>
				</div>
				{/* Customization Controls */}
				<div className="md:w-1/3 flex flex-col space-y-4 p-4">
					{/* Model Selection Dropdown */}
					<div className="flex justify-center mb-4">
						<select
							value={selectedModel}
							onChange={(e) => setSelectedModel(e.target.value)}
							className="px-4 py-2 border rounded shadow"
						>
							<option value="chair">Chair</option>
							<option value="sofa">Sofa</option>
							<option value="door">Door</option>
						</select>
					</div>
					{/* Chair Customization Controls */}
					{selectedModel === "chair" && (
						<>
							{/* Backrest Options */}
							<div className="bg-white shadow rounded p-4">
								<h3 className="text-lg font-semibold">Backrest Options</h3>
								<div className="flex gap-4 mt-2">
									{[
										"Design1.jpg",
										"Design2.jpg",
										"Design3.jpg",
										"Design4.jpg",
									].map((image, index) => (
										<div
											key={index}
											onClick={() =>
												handleBackrestChange(`Design ${index + 1}`)
											}
											className={`cursor-pointer border rounded p-1 ${
												selectedBackrest === `Design ${index + 1}`
													? "border-blue-500"
													: "border-gray-300"
											}`}
										>
											<img
												src={`/Chair/Backrest/${image}`}
												alt={`Backrest ${index + 1}`}
												className="w-20 h-20 object-cover"
											/>
										</div>
									))}
								</div>
							</div>

							{/* Seats Options */}
							<div className="bg-white shadow rounded p-4 mt-4">
								<h3 className="text-lg font-semibold">Seats Options</h3>
								<div className="flex gap-4 mt-2">
									{[
										"Design1.jpg",
										"Design2.jpg",
										"Design3.jpg",
										"Design4.jpg",
									].map((image, index) => (
										<div
											key={index}
											onClick={() => handleSeatChange(`Design ${index + 1}`)}
											className={`cursor-pointer border rounded p-1 ${
												selectedSeat === `Design ${index + 1}`
													? "border-blue-500"
													: "border-gray-300"
											}`}
										>
											<img
												src={`/Chair/Seat/${image}`}
												alt={`Seat ${index + 1}`}
												className="w-20 h-20 object-cover"
											/>
										</div>
									))}
								</div>
							</div>

							{/* Wood Options */}
							<div className="bg-white shadow rounded p-4 mt-4">
								<h3 className="text-lg font-semibold">Woods Available</h3>
								<select
									value={selectedWood}
									onChange={handleWoodChange}
									className="mt-2 px-4 py-2 border rounded shadow w-full"
								>
									<option value="" disabled>
										Select Wood Type
									</option>
									{["Acacia", "Mahogany", "Narra"].map((wood) => (
										<option key={wood} value={wood}>
											{wood}
										</option>
									))}
								</select>
							</div>
						</>
					)}

					{/* Sofa Customization Controls */}
					{selectedModel === "sofa" && (
						<>
							<div className="bg-white shadow rounded p-4">
								<h3 className="text-lg font-semibold">Sofa Backrest Options</h3>
								<div className="flex gap-4 mt-2">
									{[
										"Design1.jpg",
										"Design2.jpg",
										"Design3.jpg",
										"Design4.jpg",
									].map((image, index) => (
										<div
											key={index}
											onClick={() => handleSofaBackrest(`Design ${index + 1}`)}
											className={`cursor-pointer border rounded p-1 ${
												selectedSofaBackrest === `Design ${index + 1}`
													? "border-blue-500"
													: "border-gray-300"
											}`}
										>
											<img
												src={`/Sofa/Backrest/${image}`}
												alt={`Sofa Backrest ${index + 1}`}
												className="w-20 h-20 object-cover"
											/>
										</div>
									))}
								</div>
							</div>
							<div className="bg-white shadow rounded p-4">
								<h3 className="text-lg font-semibold">Sofa Armrest Options</h3>
								<div className="flex gap-4 mt-2">
									{["Design1.jpg", "Design2.jpg"].map((image, index) => (
										<div
											key={index}
											onClick={() => handleSofaArmrest(`Design ${index + 1}`)}
											className={`cursor-pointer border rounded p-1 ${
												selectedSofaArmrest === `Design ${index + 1}`
													? "border-blue-500"
													: "border-gray-300"
											}`}
										>
											<img
												src={`/Sofa/Armrest/${image}`}
												alt={`Backrest ${index + 1}`}
												className="w-20 h-20 object-cover"
											/>
										</div>
									))}
								</div>
							</div>
							<div className="bg-white shadow rounded p-4 mt-4">
								<h3 className="text-lg font-semibold">Woods Options</h3>
								<select
									value={selectedSofaWood}
									onChange={handleSofaWoodChange}
									className="mt-2 px-4 py-2 border rounded shadow w-full"
								>
									<option value="" disabled>
										Select Wood Type
									</option>
									<option value="Acacia">Acacia</option>
									<option value="Mahogany">Mahogany</option>
									<option value="Narra">Narra</option>
								</select>
							</div>
						</>
					)}
					{/* Door Customization Controls */}
					{selectedModel === "door" && (
						<>
							<div className="bg-white shadow rounded p-4 mt-4">
								<h3 className="text-lg font-semibold">Seats Options</h3>
								<div className="flex gap-4 mt-2">
									{[
										"Design1.jpg",
										"Design2.jpg",
										"Design3.jpg",
										"Design4.jpg",
										"Design5.jpg",
										"Design4.jpg",
										"Design7.jpg",
									].map((image, index) => (
										<div
											key={index}
											onClick={() =>
												handleDoorDesignChange(`Design ${index + 1}`)
											}
											className={`cursor-pointer border rounded p-1 ${
												selectedDoorDesign === `Design ${index + 1}`
													? "border-blue-500"
													: "border-gray-300"
											}`}
										>
											<img
												src={`/Door/${image}`}
												alt={`Door ${index + 1}`}
												className="w-20 h-20 object-cover"
											/>
										</div>
									))}
								</div>
							</div>
							<div className="bg-white shadow rounded p-4 mt-4">
								<h3 className="text-lg font-semibold">Woods Options</h3>
								<select
									value={selectedDoorWoodType}
									onChange={handleDoorWoodChange}
									className="mt-2 px-4 py-2 border rounded shadow w-full"
								>
									<option value="" disabled>
										Select Wood Type
									</option>
									<option value="Acacia">Acacia</option>
									<option value="Mahogany">Mahogany</option>
									<option value="Narra">Narra</option>
								</select>
							</div>
						</>
					)}

					{/* Quantity Input for Furniture */}
					<div className="bg-white shadow w-full flex justify-center rounded p-4 mt-4">
						<div className="flex items-center space-x-4 mt-2">
							<h3 className="text-lg font-semibold">Quantity</h3>
							<button
								onClick={() => handleQuantityChange(-1)}
								className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
							>
								-
							</button>
							<input
								type="number"
								value={quantity}
								onChange={(e) => setQuantity(Number(e.target.value))}
								className="w-16 text-center px-4 py-2 border rounded shadow"
								min="1"
							/>
							<button
								onClick={() => handleQuantityChange(1)}
								className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
							>
								+
							</button>
						</div>
					</div>

					{selectedModel === "chair" && (
						<div className="bg-gray-50 shadow rounded p-6 mt-6">
							<h3 className="text-xl font-bold text-gray-800 mb-4">
								Available Chair Sizes
							</h3>
							<div className="flex justify-end">
								<button
									onClick={toggleCustomSize}
									className="px-4 py-2 mb-4 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
								>
									{isCustomSizeVisible
										? "Return to Sizes"
										: "Customize your own size!"}
								</button>
							</div>
							{isCustomSizeVisible ? (
								<div className="bg-white shadow rounded p-4 mt-4">
									<h3 className="text-lg font-semibold">Custom Size</h3>
									<div className="grid grid-cols-2 gap-4 mt-2">
										<div>
											<label
												htmlFor="height"
												className="block text-sm font-medium"
											>
												Height{" "}
												<span className="italic font-light text-sm">
													(inches)
												</span>
											</label>
											<input
												type="number"
												id="height"
												value={customSize.height}
												onChange={(e) =>
													setCustomSize({
														...customSize,
														height: e.target.value,
													})
												}
												className="mt-1 px-4 py-2 border rounded shadow w-full"
												placeholder="Enter Height"
											/>
										</div>
										<div>
											<label
												htmlFor="length"
												className="block text-sm font-medium"
											>
												Length{" "}
												<span className="italic font-light text-sm">
													(inches)
												</span>
											</label>
											<input
												type="number"
												id="length"
												value={customSize.length}
												onChange={(e) =>
													setCustomSize({
														...customSize,
														length: e.target.value,
													})
												}
												className="mt-1 px-4 py-2 border rounded shadow w-full"
												placeholder="Enter Length"
											/>
										</div>
										<div>
											<label
												htmlFor="width"
												className="block text-sm font-medium"
											>
												Width{" "}
												<span className="italic font-light text-sm">
													(inches)
												</span>
											</label>
											<input
												type="number"
												id="width"
												value={customSize.width}
												onChange={(e) =>
													setCustomSize({
														...customSize,
														width: e.target.value,
													})
												}
												className="mt-1 px-4 py-2 border rounded shadow w-full"
												placeholder="Enter Width"
											/>
										</div>
										<div>
											<label
												htmlFor="depth"
												className="block text-sm font-medium"
											>
												Depth{" "}
												<span className="italic font-light text-sm">
													(inches)
												</span>
											</label>
											<input
												type="number"
												id="depth"
												value={customSize.depth}
												onChange={(e) =>
													setCustomSize({
														...customSize,
														depth: e.target.value,
													})
												}
												className="mt-1 px-4 py-2 border rounded shadow w-full"
												placeholder="Enter Depth"
											/>
										</div>
									</div>
								</div>
							) : (
								<ul className="mt-4 grid gap-4 sm:grid-cols-1">
									{Object.entries(chairSizes).map(
										([key, { name, dimensions }]) => (
											<li
												key={key}
												onClick={() => setSelectedSize({ name, dimensions })}
												className={`border p-4 rounded-lg shadow-sm transition-shadow cursor-pointer ${
													selectedSize?.name === name
														? "border-blue-600 bg-blue-50 shadow-md"
														: "border-gray-200 hover:shadow-md"
												}`}
											>
												<h4
													className={`text-lg font-semibold ${
														selectedSize?.name === name
															? "text-blue-600"
															: "text-gray-700"
													}`}
												>
													{name}
												</h4>
												<p className="text-sm text-gray-600">
													<span className="font-medium">Height:</span>{" "}
													{dimensions.height}"
												</p>
												<p className="text-sm text-gray-600">
													<span className="font-medium">Width:</span>{" "}
													{dimensions.width}"
												</p>
												<p className="text-sm text-gray-600">
													<span className="font-medium">Depth:</span>{" "}
													{dimensions.depth}"
												</p>
											</li>
										)
									)}
								</ul>
							)}
						</div>
					)}
					{selectedModel === "sofa" && (
						<div className="bg-gray-50 shadow rounded p-6 mt-6">
							<h3 className="text-xl font-bold text-gray-800 mb-4">
								Available Sofa Sizes
							</h3>
							<div className="flex justify-end">
								<button
									onClick={toggleCustomSize}
									className="px-4 py-2 mb-4 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
								>
									{isCustomSizeVisible
										? "Return to Sizes"
										: "Customize your own size!"}
								</button>
							</div>
							{isCustomSizeVisible ? (
								<div className="bg-white shadow rounded p-4 mt-4">
									<h3 className="text-lg font-semibold">Custom Size</h3>
									<div className="grid grid-cols-2 gap-4 mt-2">
										<div>
											<label
												htmlFor="height"
												className="block text-sm font-medium"
											>
												Height{" "}
												<span className="italic font-light text-sm">
													(inches)
												</span>
											</label>
											<input
												type="number"
												id="height"
												value={customSize.height}
												onChange={(e) =>
													setCustomSize({
														...customSize,
														height: e.target.value,
													})
												}
												className="mt-1 px-4 py-2 border rounded shadow w-full"
												placeholder="Enter Height"
											/>
										</div>
										<div>
											<label
												htmlFor="length"
												className="block text-sm font-medium"
											>
												Length{" "}
												<span className="italic font-light text-sm">
													(inches)
												</span>
											</label>
											<input
												type="number"
												id="length"
												value={customSize.length}
												onChange={(e) =>
													setCustomSize({
														...customSize,
														length: e.target.value,
													})
												}
												className="mt-1 px-4 py-2 border rounded shadow w-full"
												placeholder="Enter Length"
											/>
										</div>
										<div>
											<label
												htmlFor="width"
												className="block text-sm font-medium"
											>
												Width{" "}
												<span className="italic font-light text-sm">
													(inches)
												</span>
											</label>
											<input
												type="number"
												id="width"
												value={customSize.width}
												onChange={(e) =>
													setCustomSize({
														...customSize,
														width: e.target.value,
													})
												}
												className="mt-1 px-4 py-2 border rounded shadow w-full"
												placeholder="Enter Width"
											/>
										</div>
										<div>
											<label
												htmlFor="depth"
												className="block text-sm font-medium"
											>
												Depth{" "}
												<span className="italic font-light text-sm">
													(inches)
												</span>
											</label>
											<input
												type="number"
												id="depth"
												value={customSize.depth}
												onChange={(e) =>
													setCustomSize({
														...customSize,
														depth: e.target.value,
													})
												}
												className="mt-1 px-4 py-2 border rounded shadow w-full"
												placeholder="Enter Depth"
											/>
										</div>
									</div>
								</div>
							) : (
								<ul className="mt-4 grid gap-4 sm:grid-cols-1">
									{Object.entries(chairSizes).map(
										([key, { name, dimensions }]) => (
											<li
												key={key}
												onClick={() => setSelectedSize({ name, dimensions })}
												className={`border p-4 rounded-lg shadow-sm transition-shadow cursor-pointer ${
													selectedSize?.name === name
														? "border-blue-600 bg-blue-50 shadow-md"
														: "border-gray-200 hover:shadow-md"
												}`}
											>
												<h4
													className={`text-lg font-semibold ${
														selectedSize?.name === name
															? "text-blue-600"
															: "text-gray-700"
													}`}
												>
													{name}
												</h4>
												<p className="text-sm text-gray-600">
													<span className="font-medium">Height:</span>{" "}
													{dimensions.height}"
												</p>
												<p className="text-sm text-gray-600">
													<span className="font-medium">Width:</span>{" "}
													{dimensions.width}"
												</p>
												<p className="text-sm text-gray-600">
													<span className="font-medium">Depth:</span>{" "}
													{dimensions.depth}"
												</p>
											</li>
										)
									)}
								</ul>
							)}
						</div>
					)}
					{selectedModel === "door" && (
						<div className="bg-gray-50 shadow rounded p-6 mt-6">
							<h3 className="text-xl font-bold text-gray-800 mb-4">
								Available Chair Sizes
							</h3>
							<div className="flex justify-end">
								<button
									onClick={toggleCustomSize}
									className="px-4 py-2 mb-4 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
								>
									{isCustomSizeVisible
										? "Return to Sizes"
										: "Customize your own size!"}
								</button>
							</div>
							{isCustomSizeVisible ? (
								<div className="bg-white shadow rounded p-4 mt-4">
									<h3 className="text-lg font-semibold">Custom Size</h3>
									<div className="grid grid-cols-2 gap-4 mt-2">
										<div>
											<label
												htmlFor="height"
												className="block text-sm font-medium"
											>
												Height{" "}
												<span className="italic font-light text-sm">
													(inches)
												</span>
											</label>
											<input
												type="number"
												id="height"
												value={customSize.height}
												onChange={(e) =>
													setCustomSize({
														...customSize,
														height: e.target.value,
													})
												}
												className="mt-1 px-4 py-2 border rounded shadow w-full"
												placeholder="Enter Height"
											/>
										</div>
										<div>
											<label
												htmlFor="length"
												className="block text-sm font-medium"
											>
												Length{" "}
												<span className="italic font-light text-sm">
													(inches)
												</span>
											</label>
											<input
												type="number"
												id="length"
												value={customSize.length}
												onChange={(e) =>
													setCustomSize({
														...customSize,
														length: e.target.value,
													})
												}
												className="mt-1 px-4 py-2 border rounded shadow w-full"
												placeholder="Enter Length"
											/>
										</div>
										<div>
											<label
												htmlFor="width"
												className="block text-sm font-medium"
											>
												Width{" "}
												<span className="italic font-light text-sm">
													(inches)
												</span>
											</label>
											<input
												type="number"
												id="width"
												value={customSize.width}
												onChange={(e) =>
													setCustomSize({
														...customSize,
														width: e.target.value,
													})
												}
												className="mt-1 px-4 py-2 border rounded shadow w-full"
												placeholder="Enter Width"
											/>
										</div>
										<div>
											<label
												htmlFor="depth"
												className="block text-sm font-medium"
											>
												Depth{" "}
												<span className="italic font-light text-sm">
													(inches)
												</span>
											</label>
											<input
												type="number"
												id="depth"
												value={customSize.depth}
												onChange={(e) =>
													setCustomSize({
														...customSize,
														depth: e.target.value,
													})
												}
												className="mt-1 px-4 py-2 border rounded shadow w-full"
												placeholder="Enter Depth"
											/>
										</div>
									</div>
								</div>
							) : (
								<ul className="mt-4 grid gap-4 sm:grid-cols-1">
									{Object.entries(chairSizes).map(
										([key, { name, dimensions }]) => (
											<li
												key={key}
												onClick={() => setSelectedSize({ name, dimensions })}
												className={`border p-4 rounded-lg shadow-sm transition-shadow cursor-pointer ${
													selectedSize?.name === name
														? "border-blue-600 bg-blue-50 shadow-md"
														: "border-gray-200 hover:shadow-md"
												}`}
											>
												<h4
													className={`text-lg font-semibold ${
														selectedSize?.name === name
															? "text-blue-600"
															: "text-gray-700"
													}`}
												>
													{name}
												</h4>
												<p className="text-sm text-gray-600">
													<span className="font-medium">Height:</span>{" "}
													{dimensions.height}"
												</p>
												<p className="text-sm text-gray-600">
													<span className="font-medium">Width:</span>{" "}
													{dimensions.width}"
												</p>
												<p className="text-sm text-gray-600">
													<span className="font-medium">Depth:</span>{" "}
													{dimensions.depth}"
												</p>
											</li>
										)
									)}
								</ul>
							)}
						</div>
					)}

					{/* Display Selected Material Price */}
					{selectedModel === "chair" && selectedWood && (
						<div>
							<div className="mt-4">
								<p className="text-sm font-medium">
									Material Price:{" "}
									<span className="text-gray-800 font-semibold">
										${chairMaterials[selectedWood]?.price}
									</span>
								</p>
							</div>
						</div>
					)}

					<button
						type="submit"
						onClick={handleSubmit}
						className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
					>
						Checkout
					</button>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default ProductCustomization;
