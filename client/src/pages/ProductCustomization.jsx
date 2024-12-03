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
	Narra: { name: "Narra", price: 9000 },
	Mahogany: { name: "Mahogany", price: 3000 },
	Acacia: { name: "Acacia", price: 3000 },
};

const chairSizes = {
	Standard: {
		name: "Standard",
		dimensions: { height: 35, width: 21, depth: 18, length: 0 },
	},
};

const doorMaterials = {
	Narra: { name: "Narra", price: 12000 },
	Mahogany: { name: "Mahogany", price: 5000 },
	Acacia: { name: "Acacia", price: 5000 },
};

const doorSizes = {
	Standard_Main_Door: {
		name: "Standard Main Door",
		dimensions: { height: 78, width: 35, depth: 0, length: 0 },
	},
};
const sofaMaterials = {
	Narra: { name: "Narra", price: 80000 },
	Mahogany: { name: "Mahogany", price: 5000 },
	Acacia: { name: "Acacia", price: 5000 },
};

const sofaSizes = {
	Minimalist_Size: {
		name: "Minimalist Size",
		dimensions: { height: 11, width: 0, depth: 6, length: 18 },
	},
};

const ProductCustomization = () => {
	const navigate = useNavigate();
	const canvasRef = useRef(null);
	const [selectedModel, setSelectedModel] = useState("chair");
	const [selectedBackrest, setSelectedBackrest] = useState("");
	const [selectedSeat, setSelectedSeat] = useState("");
	const [selectedWood, setSelectedWood] = useState("");
	const [selectedDoorDesign, setselectedDoorDesign] = useState("");
	const [selectedDoorWoodType, setSelectedDoorWoodType] = useState("");
	const [selectedSofaBackrest, setSelectedSofaBackrest] = useState("");
	const [selectedSofaArmrest, setSelectedSofaArmrest] = useState("");
	const [selectedSofaWood, setSelectedSofaWood] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [selectedSize, setSelectedSize] = useState(null);
	const [customSizePrice, setCustomSizePrice] = useState(0);
	const [price, setPrice] = useState(0);
	const [isCustomSizeVisible, setCustomSizeVisible] = useState(false);
	const [customSize, setCustomSize] = useState({
		height: "",
		length: "",
		width: "",
		depth: "",
	});

	console.log("Custome Size PRice: ", customSizePrice);

	const toggleCustomSize = () => {
		setCustomSizeVisible((prev) => !prev);
		setCustomSize({ height: "", length: "", width: "", depth: "" });
	};

	const handleSizeSelection = (key) => {
		setSelectedSize(key);

		let basePrice = 0;

		// Determine the base price based on the selected model
		if (selectedModel === "chair") {
			basePrice = chairMaterials[selectedWood]?.price || 0;
		} else if (selectedModel === "sofa") {
			basePrice = sofaMaterials[selectedSofaWood]?.price || 0;
		} else if (selectedModel === "door") {
			basePrice = doorMaterials[selectedDoorWoodType]?.price || 0;
		}

		// Update price based on size selection
		if (
			key === "Standard" ||
			key === "Minimalist_Size" ||
			key === "Standard_Main_Door"
		) {
			setPrice(basePrice * quantity); // Standard size pricing
		} else {
			setPrice(customSizePrice * quantity); // Custom size pricing
		}
	};

	const calculateCustomSizePrice = () => {
    const { height, width, depth, length } = customSize;
    const h = parseFloat(height) || 0;
    const w = parseFloat(width) || 0;
    const d = parseFloat(depth) || 0;
    const l = parseFloat(length) || 0;

    const pricePerCubicInch = 0.002; // Example pricing logic
    const lengthFeePerInch = 0.1;

    let volume = 0;
    let volumePrice = 0;
    let lengthFee = 0;

    // Calculate volume price only if all necessary dimensions are present
    if (h > 0 && w > 0 && d > 0) {
        volume = h * w * d;
        volumePrice = volume * pricePerCubicInch;
    }

    // Calculate length fee only if length is relevant
    if (l > 0) {
        lengthFee = l * lengthFeePerInch;
    }

    let woodPrice = 0;

    // Dynamically select the wood price based on the model
    if (selectedModel === "chair") {
        woodPrice = chairMaterials[selectedWood]?.price || 0;
    } else if (selectedModel === "sofa") {
        woodPrice = sofaMaterials[selectedSofaWood]?.price || 0;
    } else if (selectedModel === "door") {
        woodPrice = doorMaterials[selectedDoorWoodType]?.price || 0;
    }

    // Calculate custom size price
    const customPrice = (volumePrice + lengthFee + woodPrice) * quantity;
    setCustomSizePrice(customPrice); // Update state with the custom size price
};


	useEffect(() => {
		if (isCustomSizeVisible) {
			calculateCustomSizePrice();
		}
	}, [customSize, selectedWood, isCustomSizeVisible, quantity]);

	const handleQuantityChange = (change) => {
		setQuantity((prevQuantity) => {
			const newQuantity = prevQuantity + change;
			if (newQuantity > 0) {
				const updatedPrice = calculateTotalPrice(newQuantity); // Recalculate price based on new quantity
				setPrice(updatedPrice); // Update the price state
				return newQuantity;
			}
			return 1; // Ensure quantity is never less than 1
		});
	};

	const handleBackrestChange = (design) => {
		if (selectedModel === "chair") setSelectedBackrest(design);
	};

	const handleSeatChange = (design) => {
		if (selectedModel === "chair") setSelectedSeat(design);
	};

	const handleWoodChange = (e) => {
		const woodType = e.target.value;
		setSelectedWood(woodType);
		// Update the base price when wood type changes
		setPrice(chairMaterials[woodType]?.price || 0);
	};

	const handleSofaBackrest = (design) => {
		if (selectedModel === "sofa") setSelectedSofaBackrest(design);
	};

	const handleSofaArmrest = (design) => {
		if (selectedModel === "sofa") setSelectedSofaArmrest(design);
	};

	const handleSofaWoodChange = (e) => {
		const woodType = e.target.value;
		if (selectedModel === "sofa") {
			setSelectedSofaWood(woodType);
			// Update price based on selected wood
			setPrice(sofaMaterials[woodType]?.price || 0);
		}
	};

	const handleDoorDesignChange = (design) => {
		if (selectedModel === "door") setselectedDoorDesign(design);
	};

	const handleDoorWoodChange = (e) => {
		const woodType = e.target.value;
		if (selectedModel === "door") {
			setSelectedDoorWoodType(woodType);
			// Update price based on selected wood
			setPrice(doorMaterials[woodType]?.price || 0);
		}
	};

	useEffect(() => {
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

	const validateForm = () => {
		if (!selectedModel) {
			alert("Please select a piece of furniture to checkout.");
			return false;
		}
		if (selectedModel === "chair") {
			if (!selectedBackrest || !selectedSeat || !selectedWood) {
				alert("Chair backrest, seat design, and wood type are required.");
				return false;
			}
		}
		if (selectedModel === "sofa") {
			if (!selectedSofaBackrest || !selectedSofaArmrest || !selectedSofaWood) {
				alert("Sofa backrest, armrest design, and wood type are required.");
				return false;
			}
		}
		if (selectedModel === "door") {
			if (!selectedDoorDesign || !selectedDoorWoodType) {
				alert("Door design and wood type are required.");
				return false;
			}
		}
		return true;
	};

	const handleSubmit = async () => {
    if (!validateForm()) return;

    let formData;
    let basePrice = 0;
    let dimensions = {}; // To store the dimensions for the selected size

    // Determine the base price and dimensions based on the selected model
    if (selectedModel === "chair") {
        basePrice = chairMaterials[selectedWood]?.price || 0;
        if (selectedSize === "Standard") {
            dimensions = chairSizes.Standard.dimensions; // Use standard chair dimensions
        } else {
            dimensions = customSize; // Use custom size dimensions
        }
    } else if (selectedModel === "sofa") {
        basePrice = sofaMaterials[selectedSofaWood]?.price || 0;
        if (selectedSize === "Minimalist_Size") {
            dimensions = sofaSizes.Minimalist_Size.dimensions; // Use standard sofa dimensions
        } else {
            dimensions = customSize; // Use custom size dimensions
        }
    } else if (selectedModel === "door") {
        basePrice = doorMaterials[selectedDoorWoodType]?.price || 0;
        if (selectedSize === "Standard_Main_Door") {
            dimensions = doorSizes.Standard_Main_Door.dimensions; // Use standard door dimensions
        } else {
            dimensions = customSize; // Use custom size dimensions
        }
    }

    // Construct the formData object based on the selected model
    if (selectedModel === "chair") {
        formData = {
            model: "chair",
            selectedBackrest : selectedBackrest,
            selectedSeat : selectedSeat,
            selectedWood : selectedWood,
            quantity,
            size: selectedSize || "Standard", // Default to Standard if no size is selected
            dimensions, // Include the dimensions
            price, // Total price
        };
    } else if (selectedModel === "sofa") {
        formData = {
            model: "sofa",
            selectedBackrest : selectedSofaBackrest,
            selectedArmrest : selectedSofaArmrest,
            selectedWood : selectedSofaWood,
            quantity,
            size: selectedSize || "Minimalist_Size", // Default to Minimalist Size if no size is selected
            dimensions, // Include the dimensions
            price, // Total price
        };
    } else if (selectedModel === "door") {
        formData = {
            model: "door",
            selectedDesign : selectedDoorDesign,
            selectedWood : selectedDoorWoodType,
            quantity,
            size: selectedSize || "Standard_Main_Door", // Default to Standard Main Door if no size is selected
            dimensions, // Include the dimensions
            price, // Total price
        };
    }

    console.log("FormData: ", formData);
    // navigate("/customize-product/checkout", { state: formData });
};


	const calculateTotalPrice = (quantity) => {
		let basePrice = 0;

		// Determine the base price based on the selected model and wood type
		if (selectedModel === "chair") {
			basePrice = chairMaterials[selectedWood]?.price || 0;
		} else if (selectedModel === "sofa") {
			basePrice = sofaMaterials[selectedSofaWood]?.price || 0;
		} else if (selectedModel === "door") {
			basePrice = doorMaterials[selectedDoorWoodType]?.price || 0;
		}

		// Use custom size price if custom size is enabled
		if (isCustomSizeVisible) {
			return customSizePrice * quantity;
		}

		// Otherwise, calculate using the base price and quantity
		return basePrice * quantity;
	};

	useEffect(() => {
		const updatedPrice = calculateTotalPrice(quantity); // Recalculate price with quantity
		setPrice(updatedPrice); // Update the price state
	}, [selectedWood, isCustomSizeVisible, customSizePrice, quantity]);

	const totalPrice = calculateTotalPrice();

	return (
		<div className="flex flex-col h-screen">
			<Header isLogin={true} />
			<div className="flex-grow flex flex-col md:flex-row bg-gray-100 p-4">
				<div className="flex-grow md:w-2/3 flex items-center justify-center">
					<Canvas ref={canvasRef}>
						<ambientLight intensity={0.7} color="#ffffff" />
						<directionalLight
							position={[5, 10, 5]}
							intensity={1.2}
							castShadow
						/>
						<pointLight position={[0, 5, 0]} intensity={0.8} color="#ffd700" />
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
					</Canvas>
				</div>
				<div className="md:w-1/3 flex flex-col space-y-4 p-4">
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
					{selectedModel === "chair" && (
						<>
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
												alt={`Armrest ${index + 1}`}
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
								<h3 className="text-lg font-semibold">Door Design Options</h3>
								<div className="flex gap-4 mt-2">
									{[
										"Design1.jpg",
										"Design2.jpg",
										"Design3.jpg",
										"Design4.jpg",
										"Design5.jpg",
										"Design6.jpg",
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
								onChange={(e) =>
									setQuantity(Math.max(1, Number(e.target.value)))
								}
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
					{/* Size Customization for Chair */}
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
								<div className="flex flex-col space-y-4">
									<input
										type="number"
										placeholder="Height (inches)"
										value={customSize.height}
										onChange={(e) =>
											setCustomSize({ ...customSize, height: e.target.value })
										}
										className="px-4 py-2 border rounded shadow"
									/>
									<input
										type="number"
										placeholder="Width (inches)"
										value={customSize.width}
										onChange={(e) =>
											setCustomSize({ ...customSize, width: e.target.value })
										}
										className="px-4 py-2 border rounded shadow"
									/>
									<input
										type="number"
										placeholder="Depth (inches)"
										value={customSize.depth}
										onChange={(e) =>
											setCustomSize({ ...customSize, depth: e.target.value })
										}
										className="px-4 py-2 border rounded shadow"
									/>
									<input
										type="number"
										placeholder="Length (inches)"
										value={customSize.length}
										onChange={(e) =>
											setCustomSize({ ...customSize, length: e.target.value })
										}
										className="px-4 py-2 border rounded shadow"
									/>
								</div>
							) : (
								<div className="flex flex-col space-y-2">
									{Object.keys(chairSizes).map((key) => (
										<button
											key={key}
											onClick={() => handleSizeSelection(key)}
											className={`px-4 py-2 border rounded shadow ${
												selectedSize === key
													? "bg-blue-500 text-white"
													: "bg-white"
											}`}
										>
											{key} - (Price based on wood type)
										</button>
									))}
								</div>
							)}
						</div>
					)}
					{/* Size Customization for Chair */}
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
								<div className="flex flex-col space-y-4">
									<input
										type="number"
										placeholder="Height (inches)"
										value={customSize.height}
										onChange={(e) =>
											setCustomSize({ ...customSize, height: e.target.value })
										}
										className="px-4 py-2 border rounded shadow"
									/>
									<input
										type="number"
										placeholder="Width (inches)"
										value={customSize.width}
										onChange={(e) =>
											setCustomSize({ ...customSize, width: e.target.value })
										}
										className="px-4 py-2 border rounded shadow"
									/>
									<input
										type="number"
										placeholder="Depth (inches)"
										value={customSize.depth}
										onChange={(e) =>
											setCustomSize({ ...customSize, depth: e.target.value })
										}
										className="px-4 py-2 border rounded shadow"
									/>
									<input
										type="number"
										placeholder="Length (inches)"
										value={customSize.length}
										onChange={(e) =>
											setCustomSize({ ...customSize, length: e.target.value })
										}
										className="px-4 py-2 border rounded shadow"
									/>
								</div>
							) : (
								<div className="flex flex-col space-y-2">
									{Object.keys(sofaSizes).map((key) => (
										<button
											key={key}
											onClick={() => handleSizeSelection(key)}
											className={`px-4 py-2 border rounded shadow ${
												selectedSize === key
													? "bg-blue-500 text-white"
													: "bg-white"
											}`}
										>
											{key} - (Price based on wood type)
										</button>
									))}
								</div>
							)}
						</div>
					)}
					{/* Size Customization for Chair */}
					{selectedModel === "door" && (
						<div className="bg-gray-50 shadow rounded p-6 mt-6">
							<h3 className="text-xl font-bold text-gray-800 mb-4">
								Available Door Sizes
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
								<div className="flex flex-col space-y-4">
									<input
										type="number"
										placeholder="Height (inches)"
										value={customSize.height}
										onChange={(e) =>
											setCustomSize({ ...customSize, height: e.target.value })
										}
										className="px-4 py-2 border rounded shadow"
									/>
									<input
										type="number"
										placeholder="Width (inches)"
										value={customSize.width}
										onChange={(e) =>
											setCustomSize({ ...customSize, width: e.target.value })
										}
										className="px-4 py-2 border rounded shadow"
									/>
									<input
										type="number"
										placeholder="Depth (inches)"
										value={customSize.depth}
										onChange={(e) =>
											setCustomSize({ ...customSize, depth: e.target.value })
										}
										className="px-4 py-2 border rounded shadow"
									/>
									<input
										type="number"
										placeholder="Length (inches)"
										value={customSize.length}
										onChange={(e) =>
											setCustomSize({ ...customSize, length: e.target.value })
										}
										className="px-4 py-2 border rounded shadow"
									/>
								</div>
							) : (
								<div className="flex flex-col space-y-2">
									{Object.keys(doorSizes).map((key) => (
										<button
											key={key}
											onClick={() => handleSizeSelection(key)}
											className={`px-4 py-2 border rounded shadow ${
												selectedSize === key
													? "bg-blue-500 text-white"
													: "bg-white"
											}`}
										>
											{key} - (Price based on wood type)
										</button>
									))}
								</div>
							)}
						</div>
					)}
					{/* Pricing Summary Section */}
					<div className="bg-white shadow rounded p-4 mt-6">
						<h3 className="text-lg font-semibold">Pricing Summary</h3>
						<div className="mt-2">
							<p>
								Model:{" "}
								<strong>
									{selectedModel.charAt(0).toUpperCase() +
										selectedModel.slice(1)}
								</strong>
							</p>
							{selectedModel === "chair" && (
								<>
									<p>
										Backrest: <strong>{selectedBackrest}</strong>
									</p>
									<p>
										Seat: <strong>{selectedSeat}</strong>
									</p>
									<p>
										Wood Type: <strong>{selectedWood}</strong>
									</p>
									<p>
										Size:{" "}
										<strong>
											{selectedSize ? selectedSize : "Custom Size"}
										</strong>
									</p>
								</>
							)}
							{selectedModel === "sofa" && (
								<>
									<p>
										Backrest: <strong>{selectedSofaBackrest}</strong>
									</p>
									<p>
										Armrest: <strong>{selectedSofaArmrest}</strong>
									</p>
									<p>
										Wood Type: <strong>{selectedSofaWood}</strong>
									</p>
								</>
							)}
							{selectedModel === "door" && (
								<>
									<p>
										Door Design: <strong>{selectedDoorDesign}</strong>
									</p>
									<p>
										Wood Type: <strong>{selectedDoorWoodType}</strong>
									</p>
								</>
							)}
							<p>
								Quantity: <strong>{quantity}</strong>
							</p>
							<p>
								Total Price: <strong>${price || 0}</strong>
							</p>
						</div>
					</div>
					{/* Checkout Button */}
					<div className="flex justify-center mt-6">
						<button
							onClick={handleSubmit}
							className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
						>
							Checkout
						</button>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default ProductCustomization;
