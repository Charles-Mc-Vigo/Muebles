import React, { useState } from "react";

const ProductManagement = () => {
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedFurnitureType, setSelectedFurnitureType] = useState("");
	const [newFurniture, setNewFurniture] = useState({
		image: "",
		name: "",
		category: "",
		furnitureType: "",
		description: "",
		materials: [],
		colors: [],
		sizes: [],
		stocks: "",
		price: "",
	});

	const handleCategoryChange = (e) => {
		const categoryId = e.target.value;
		setSelectedCategory(categoryId);
		setNewFurniture((prev) => ({
			...prev,
			category: categoryId,
			furnitureType: "",
		}));
		setSelectedFurnitureType("");
	};

	const handleFurnitureTypeChange = (e) => {
		const furnitureTypeId = e.target.value;
		setSelectedFurnitureType(furnitureTypeId);
		setNewFurniture((prev) => ({
			...prev,
			furnitureType: furnitureTypeId,
		}));
	};

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		if (type === "checkbox") {
			if (name === "material") {
				setNewFurniture((prev) => ({
					...prev,
					materials: checked
						? [...prev.materials, value]
						: prev.materials.filter((material) => material !== value),
				}));
			} else if (name === "color") {
				setNewFurniture((prev) => ({
					...prev,
					colors: checked
						? [...prev.colors, value]
						: prev.colors.filter((color) => color !== value),
				}));
			} else if (name === "size") {
				setNewFurniture((prev) => ({
					...prev,
					sizes: checked
						? [...prev.sizes, value]
						: prev.sizes.filter((size) => size !== value),
				}));
			}
		} else {
			setNewFurniture((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setNewFurniture((prev) => ({
					...prev,
					image: reader.result.split(",")[1],
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Form submitted:", newFurniture);
	};

	// Placeholder data (you'll replace these with API data later)
	const categories = [
		{ _id: "1", name: "Living Room" },
		{ _id: "2", name: "Bedroom" },
	];

	const furnitureTypes = [
		{ _id: "1", name: "Chair" },
		{ _id: "2", name: "Table" },
	];

	const materials = [
		{ _id: "1", name: "Wood" },
		{ _id: "2", name: "Metal" },
	];

	const colors = [
		{ _id: "1", name: "Brown" },
		{ _id: "2", name: "Black" },
	];

	const sizes = [
		{ _id: "1", label: "Small" },
		{ _id: "2", label: "Medium" },
	];

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6 text-center">
				Product Management
			</h1>
			<div className="flex flex-row justify-center">
				<form onSubmit={handleSubmit} className="mb-6 space-y-4 w-1/2">
					<input
						id="name"
						type="text"
						name="name"
						placeholder="Product Name"
						value={newFurniture.name}
						onChange={handleInputChange}
						required
						className="border rounded p-2 w-full"
					/>

					<select
						id="category"
						name="category"
						value={selectedCategory}
						onChange={handleCategoryChange}
						required
						className="border rounded p-2 w-full"
					>
						<option value="">Select Category</option>
						{categories.map((category) => (
							<option key={category._id} value={category._id}>
								{category.name}
							</option>
						))}
					</select>

					<select
						id="furnitureType"
						name="furnitureType"
						value={selectedFurnitureType}
						onChange={handleFurnitureTypeChange}
						required
						className="border rounded p-2 w-full"
					>
						<option value="">Select Type</option>
						{furnitureTypes.map((furnitureType) => (
							<option key={furnitureType._id} value={furnitureType._id}>
								{furnitureType.name}
							</option>
						))}
					</select>

					<textarea
						id="description"
						name="description"
						placeholder="Description"
						value={newFurniture.description}
						onChange={handleInputChange}
						required
						className="border rounded p-2 w-full"
					/>

					<input
						id="price"
						type="number"
						name="price"
						placeholder="Price"
						value={newFurniture.price}
						onChange={handleInputChange}
						required
						className="border rounded p-2 w-full"
					/>

					<input
						id="stocks"
						type="number"
						name="stocks"
						placeholder="Available Stocks"
						value={newFurniture.stocks}
						onChange={handleInputChange}
						required
						className="border rounded p-2 w-full"
					/>

					<div className="mb-4">
						<label className="block font-semibold">Materials:</label>
						<div className="flex flex-col space-y-2">
							{materials.map((material) => (
								<label key={material._id} className="flex items-center">
									<input
										type="checkbox"
										name="material"
										value={material.name}
										checked={newFurniture.materials.includes(material.name)}
										onChange={handleInputChange}
										className="mr-2 h-4 w-4 border rounded text-blue-600 focus:ring-blue-500"
									/>
									<span className="text-gray-700">
										{material.name.charAt(0).toUpperCase() + material.name.slice(1)}
									</span>
								</label>
							))}
						</div>
					</div>

					<div className="mb-4">
						<label className="block font-semibold">Colors:</label>
						<div className="flex flex-col space-y-2">
							{colors.map((color) => (
								<label key={color._id} className="flex items-center">
									<input
										type="checkbox"
										name="color"
										value={color.name}
										checked={newFurniture.colors.includes(color.name)}
										onChange={handleInputChange}
										className="mr-2 h-4 w-4 border rounded text-blue-600 focus:ring-blue-500"
									/>
									<span className="text-gray-700">
										{color.name.charAt(0).toUpperCase() + color.name.slice(1)}
									</span>
								</label>
							))}
						</div>
					</div>

					<div className="mb-4">
						<label className="block font-semibold">Sizes:</label>
						<div className="flex flex-col space-y-2">
							{sizes.map((size) => (
								<label key={size._id} className="flex items-center">
									<input
										type="checkbox"
										name="size"
										value={size.label}
										checked={newFurniture.sizes.includes(size.label)}
										onChange={handleInputChange}
										className="mr-2 h-4 w-4 border rounded text-blue-600 focus:ring-blue-500"
									/>
									<span className="text-gray-700">
										{size.label.charAt(0).toUpperCase() + size.label.slice(1)}
									</span>
								</label>
							))}
						</div>
					</div>

					<input
						id="image"
						type="file"
						name="image"
						onChange={handleFileChange}
						required
						className="border rounded p-2 w-full"
					/>

					<button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
						Add Product
					</button>
				</form>
			</div>
		</div>
	);
};

export default ProductManagement;