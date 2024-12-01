import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Chair } from "../Models/ChairModels";
import { Sofa } from "../Models/DesignSofa";
import { Door } from "../Models/DesignDoor";
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
											onClick={() =>
												handleSofaBackrest(`Design ${index + 1}`)
											}
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
									{[
										"Design1.jpg",
										"Design2.jpg",
									].map((image, index) => (
										<div
											key={index}
											onClick={() =>
												handleSofaArmrest(`Design ${index + 1}`)
											}
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
											onClick={() => handleDoorDesignChange(`Design ${index + 1}`)}
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
