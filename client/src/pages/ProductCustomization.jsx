import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Chair } from "../Models/ChairModels";
import { Door } from "../Models/DoorModels";

const ProductCustomization = () => {
	// State for selected model
	const [selectedModel, setSelectedModel] = useState("chair");
	// for chair
	const [selectedBackrest, setSelectedBackrest] = useState(0);
	const [selectedSeat, setSelectedSeat] = useState(0);

	// for door
	const [selectedDesign, setSelectedDesign] = useState(1);

	// Handlers for each part selection (specific to Chair)
	const handleBackrestChange = (designIndex) => {
		if (selectedModel === "chair") setSelectedBackrest(designIndex);
	};

	const handleSeatChange = (designIndex) => {
		if (selectedModel === "chair") setSelectedSeat(designIndex);
	};

	const handleDoorDesignChange = (designIndex) => {
		if (selectedModel === "door") setSelectedDesign(designIndex);
		console.log(selectedDesign); //for debugging
	};

	// Handlers for each part selectiong (door)

	return (
		<div className="flex flex-col h-screen">
			{/* Canvas for the 3D model */}
			<div className="flex-grow bg-slate-200">
				<Canvas>
					<ambientLight intensity={0.5} />
					<directionalLight position={[10, 10, 10]} />
					{/* Conditionally render models */}
					{selectedModel === "chair" && (
						<Chair
							selectedBackrest={selectedBackrest}
							selectedSeat={selectedSeat}
						/>
					)}
					{selectedModel === "door" && <Door selectedDesign={selectedDesign} />}
					<OrbitControls enableZoom={false} />
				</Canvas>
			</div>

			{/* Model Selection Dropdown */}
			<div className="flex justify-center bg-gray-300 p-4">
				<select
					value={selectedModel}
					onChange={(e) => setSelectedModel(e.target.value)}
					className="px-4 py-2 border rounded"
				>
					<option value="chair">Chair</option>
					<option value="door">Door</option>
				</select>
			</div>

			{/* Customization Controls - Only for Chair */}
			{selectedModel === "chair" && (
				<div className="flex flex-col md:flex-row">
					{/* Backrest customization controls */}
					<div className="flex-1 bg-blue-200 p-4">
						<h3 className="text-lg font-semibold">Backrest Options</h3>
						<div className="flex flex-wrap gap-2">
							<button
								onClick={() => handleBackrestChange(0)}
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
							>
								Default
							</button>
							{[1, 2, 3, 4].map((index) => (
								<button
									key={`backrest-${index}`}
									onClick={() => handleBackrestChange(index)}
									className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								>
									Design {index}
								</button>
							))}
						</div>
					</div>

					{/* Seat customization controls */}
					<div className="flex-1 bg-orange-200 p-4">
						<h3 className="text-lg font-semibold">Seat Options</h3>
						<div className="flex flex-wrap gap-2">
							<button
								onClick={() => handleSeatChange(0)}
								className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
							>
								Default
							</button>
							{[1, 2, 3, 4].map((index) => (
								<button
									key={`seat-${index}`}
									onClick={() => handleSeatChange(index)}
									className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
								>
									Design {index}
								</button>
							))}
						</div>
					</div>
				</div>
			)}

			{selectedModel === "door" && (
				<div className="flex flex-col md:flex-row">
					{/* Door designs */}
					<div className="flex-1 bg-blue-200 p-4">
						<h3 className="text-lg font-semibold">Door Designs</h3>
						<div className="flex flex-wrap gap-2">
							<button
								onClick={() => handleDoorDesignChange(0)}
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
							>
								Default
							</button>
							{[0,1, 2, 3, 4, 5, 6, 7].map((index) => (
								<button
									key={`door-${index}`}
									onClick={() => handleDoorDesignChange(index)}
									className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								>
									Design {index}
								</button>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductCustomization;
