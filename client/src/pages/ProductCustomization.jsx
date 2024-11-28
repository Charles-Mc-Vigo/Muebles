import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Chair } from "../Models/ChairModels";
import { Sofa } from "../Models/DesignSofa";
import { Door } from "../Models/DesignDoor";
import { Table } from "../Models/Table";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const RotatingObject = ({ children }) => {
	const groupRef = useRef();

	useFrame(() => {
		if (groupRef.current) {
			groupRef.current.rotation.y += 0.0;
		}
	});

	return <group ref={groupRef}>{children}</group>;
};

const ProductCustomization = () => {
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

	// for table
	const [selectedTableTop, setSelectedTableTop] = useState("");
	const [selectedTableLeg, setSelectedTableLeg] = useState("");
	const [selectedTableWood, setSelectedTableWood] = useState("");

	// Handlers for each part selection
	const handleBackrestChange = (e) => {
		if (selectedModel === "chair") setSelectedBackrest(e.target.value);
	};
	const handleSeatChange = (e) => {
		if (selectedModel === "chair") setSelectedSeat(e.target.value);
	};

	const handleWoodChange = (e) => {
		if (selectedModel === "chair") setSelectedWood(e.target.value);
	};

	// handle backrest of sofa
	const handleSofaBackrest = (e) => {
		if (selectedModel === "sofa") setSelectedSofaBackrest(e.target.value);
	};
	const handleSofaArmrest = (e) => {
		if (selectedModel === "sofa") setSelectedSofaArmrest(e.target.value);
	};

	const handleSofaWoodChange = (e) => {
		if (selectedModel === "sofa") setSelectedSofaWood(e.target.value);
	};

	// for door
	const handleDoorDesignChange = (e) => {
		if (selectedModel === "door") setselectedDoorDesign(e.target.value);
	};

	const handleDoorWoodChange = (e) => {
		if (selectedModel === "door") setSelectedDoorWoodType(e.target.value);
	};

	// for table
	const handleTableTopChange = (e) => {
		if (selectedModel === "table") setSelectedTableTop(e.target.value);
	};
	const handleTableLegChange = (e) => {
		if (selectedModel === "table") setSelectedTableLeg(e.target.value);
	};
	const handleTableWoodChange = (e) => {
		if (selectedModel === "table") setSelectedTableWood(e.target.value);
	};

	// console.log(selectedWood);

	// const handleSubmit = async () => {
	//   if(selectedModel === "chair"){
	//     FormData = new FormData();
	//   }
	//   try {
	//     // // Example: Simulate form submission or API call
	//     // const response = await fetch('/api/submit', {
	//     //   method: 'POST',
	//     //   headers: {
	//     //     'Content-Type': 'application/json',
	//     //   },
	//     //   body: JSON.stringify({
	//     //     woodType: selectedWood,
	//     //     backrest: selectedBackrest,
	//     //     seat: selectedSeat,
	//     //   }),
	//     // });

	//     // if (!response.ok) {
	//     //   throw new Error('Failed to submit. Please try again.');
	//     // }

	//     // const result = await response.json();
	//     // console.log('Submission successful:', result);

	//     // // Optional: Reset form or show success message
	//     // alert('Submission successful!');
	//   } catch (error) {
	//     console.error('Error:', error);
	//     alert('Something went wrong! Please try again.');
	//   }
	// };

	return (
		<div className="flex flex-col h-screen">
			<Header isLogin={true} />
			<div className="flex-grow flex flex-col md:flex-row bg-gray-100 p-4">
				{/* Canvas for the 3D model */}
				<div className="flex-grow md:w-2/3 flex items-center justify-center">
					<Canvas>
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
						{selectedModel === "table" && (
							<RotatingObject>
								<Table
									selectedTableTop={selectedTableTop}
									selectedTableLeg={selectedTableLeg}
									selectedTableWood={selectedTableWood}
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
							<option value="table">Table</option>
						</select>
					</div>
					{/* Chair Customization Controls */}
					{selectedModel === "chair" && (
						<>
							<div className="bg-white shadow rounded p-4">
								<h3 className="text-lg font-semibold">Backrest Options</h3>
								<select
									value={selectedBackrest}
									onChange={handleBackrestChange}
									className="mt-2 px-4 py-2 border rounded shadow w-full"
								>
									<option value="" disabled>
										Select Backrest Design
									</option>{" "}
									{["Design 1", "Design 2", "Design 3", "Design 4"].map(
										(index) => (
											<option key={index} value={index}>
												{index}
											</option>
										)
									)}
								</select>
							</div>
							<div className="bg-white shadow rounded p-4">
								<h3 className="text-lg font-semibold">Seats Options</h3>
								<select
									value={selectedSeat}
									onChange={handleSeatChange}
									className="mt-2 px-4 py-2 border rounded shadow w-full"
								>
									<option value="" disabled>
										Select Seat Design
									</option>{" "}
									{["Design 1", "Design 2", "Design 3", "Design 4"].map(
										(index) => (
											<option key={index} value={index}>
												{index}
											</option>
										)
									)}
								</select>
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
									<option value="Acacia">Acacia</option>
									<option value="Mahogany">Mahogany</option>
									<option value="Narra">Narra</option>
								</select>
							</div>
						</>
					)}

					{/* Table Customization Controls */}
					{selectedModel === "table" && (
						<>
							<div className="bg-white shadow rounded p-4">
								<h3 className="text-lg font-semibold">Table Top Option</h3>
								<select
									value={selectedTableTop}
									onChange={handleTableTopChange}
									className="mt-2 px-4 py-2 border rounded shadow w-full"
								>
									<option value="" disabled>
										Select Table Top Designs
									</option>{" "}
									{["Design 1", "Design 2", "Design 3"].map((index) => (
										<option key={index} value={index}>
											{index}
										</option>
									))}
								</select>
							</div>
							<div className="bg-white shadow rounded p-4">
								<h3 className="text-lg font-semibold">Table Legs Options</h3>
								<select
									value={selectedTableLeg}
									onChange={handleTableLegChange}
									className="mt-2 px-4 py-2 border rounded shadow w-full"
								>
									<option value="" disabled>
										Select Table Legs Design
									</option>{" "}
									{["Design 1", "Design 2"].map((index) => (
										<option key={index} value={index}>
											{index}
										</option>
									))}
								</select>
							</div>
							<div className="bg-white shadow rounded p-4 mt-4">
								<h3 className="text-lg font-semibold">Woods Option</h3>
								<select
									value={selectedTableWood}
									onChange={handleTableWoodChange}
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

					{/* Sofa Customization Controls */}
					{selectedModel === "sofa" && (
						<>
							<div className="bg-white shadow rounded p-4">
								<h3 className="text-lg font-semibold">Sofa Backrest Option</h3>
								<select
									value={selectedSofaBackrest}
									onChange={handleSofaBackrest}
									className="mt-2 px-4 py-2 border rounded shadow w-full"
								>
									<option value="" disabled>
										Select Sofa Backrest Design
									</option>{" "}
									{["Design 1", "Design 2", "Design 3", "Design 4"].map(
										(index) => (
											<option key={index} value={index}>
												{index}
											</option>
										)
									)}
								</select>
							</div>
							<div className="bg-white shadow rounded p-4">
								<h3 className="text-lg font-semibold">Sofa Armrest Options</h3>
								<select
									value={selectedSofaArmrest}
									onChange={handleSofaArmrest}
									className="mt-2 px-4 py-2 border rounded shadow w-full"
								>
									<option value="" disabled>
										Select Sofa Armrest Design
									</option>{" "}
									{["Design 1", "Design 2"].map((index) => (
										<option key={index} value={index}>
											{index}
										</option>
									))}
								</select>
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
							<div className="bg-white shadow rounded p-4">
								<h3 className="text-lg font-semibold">Door Designs</h3>
								<select
									value={selectedDoorDesign}
									onChange={handleDoorDesignChange}
									className="mt-2 px-4 py-2 border rounded shadow w-full"
								>
									<option value="" disabled>
										Select Door Design
									</option>
									{[
										"Design 1",
										"Design 2",
										"Design 3",
										"Design 4",
										"Design 5",
										"Design 6",
										"Design 7",
									].map((index) => (
										<option key={index} value={index}>
											{index}
										</option>
									))}
								</select>
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
					<button
						type="submit"
						// onClick={handleSubmit}
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
