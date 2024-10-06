import React, { useEffect, useState } from "react";
import axios from "axios"; // Import Axios

const ProductManagement = () => {
	const [furnitures, setFurnitures] = useState([]); // State to hold furniture data
	const [materials, setMaterials] = useState([]); // State to hold materials data
	const [colors, setColors] = useState([]); // State to hold colors data
	const [sizes, setSizes] = useState([]); // State to hold sizes data
	const [categories, setCategories] = useState([]); // State to hold categories
	const [furnitureTypes, setFurnitureTypes] = useState([]); // State to hold furniture types
	const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
	const [selectedFurnitureType, setSelectedFurnitureType] = useState(""); // State for selected furniture type
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

	const [noFurnitureFound, setNoFurnitureFound] = useState(false); // State to notify no furniture found

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [
					furnituresResponse,
					materialsResponse,
					colorsResponse,
					categoriesResponse,
				] = await Promise.all([
					axios.get("http://localhost:3000/api/furnitures"),
					axios.get("http://localhost:3000/api/materials"),
					axios.get("http://localhost:3000/api/colors"),
					axios.get("http://localhost:3000/api/categories"),
				]);

				// Debugging logs
				console.log("Categories Response:", categoriesResponse.data);

				setFurnitures(furnituresResponse.data);
				setMaterials(materialsResponse.data);
				setColors(colorsResponse.data);
				setCategories(categoriesResponse.data);

				setNoFurnitureFound(furnituresResponse.data.length === 0);
			} catch (error) {
				console.error("Error fetching data:", error);
				alert("Error fetching data:");
				setNoFurnitureFound(true);
			}
		};
		fetchData();
	}, []);

	const handleCategoryChange = (e) => {
		const categoryId = e.target.value;
		console.log("Category selected:", categoryId); // Debug log
		setSelectedCategory(categoryId);
		setNewFurniture((prev) => ({
			...prev,
			category: categoryId,
			furnitureType: "", // Reset furniture type when category changes
		}));
		setSelectedFurnitureType(""); // Reset selected furniture type
		setSizes([]); // Clear sizes
		if (categoryId) {
			fetchFurnitureTypes(categoryId);
		} else {
			setFurnitureTypes([]); // Clear furniture types if no category is selected
		}
	};
	
	const fetchFurnitureTypes = async (categoryId) => {
		if (!categoryId) return; // Don't fetch if no category is selected
		try {
			console.log("Fetching furniture types for category:", categoryId); // Debug log
			const response = await axios.get(
				`http://localhost:3000/api/furniture-types/category/${categoryId}`
			);
			console.log("Furniture types received:", response.data); // Debug log
			setFurnitureTypes(response.data);
		} catch (error) {
			console.error("Error fetching furniture types:", error);
			setFurnitureTypes([]); // Reset to empty array on error
		}
	};

	const handleFurnitureTypeChange = (e) => {
		const furnitureTypeId = e.target.value;
		console.log("Furniture type selected:", furnitureTypeId); // Debug log

		setSelectedFurnitureType(furnitureTypeId);
		setNewFurniture((prev) => ({
			...prev,
			furnitureType: furnitureTypeId,
		}));

		if (furnitureTypeId) {
			setSizes(furnitureTypeId);
		} else {
			setSizes([]); // Clear sizes if no furniture type is selected
		}
	};

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		if (type === "checkbox") {
			// Handle checkbox inputs for materials, colors, and sizes
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
			// Handle other inputs
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
					image: reader.result.split(",")[1], // Store base64 string without the prefix
				}));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		console.log("Submitting furniture data:", newFurniture); // Log the data being sent
		try {
			// Send the new furniture data to the API
			await axios.post(
				"http://localhost:3000/api/furnitures/add",
				newFurniture
			);
			// Reset the form after submission
			setNewFurniture({
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
			// Fetch the updated list of furnitures
			const response = await axios.get("http://localhost:3000/api/furnitures");
			setFurnitures(response.data); // Update the furniture list
		} catch (error) {
			console.error("Error adding furniture:", error);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6 text-center">
				Product Management
			</h1>
			<div className="flex flex-row justify-between">
				{/* Add Product Form */}
				<form onSubmit={handleSubmit} className="mb-6 space-y-4 w-1/3">
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
					{/* Furniture Category Dropdown */}
					<select
						id="category"
						name="category"
						value={selectedCategory}
						onChange={handleCategoryChange}
						required
						className="border rounded p-2 w-full"
					>
						<option value="">Select Category</option>
						{categories.length > 0 ? (
							categories.map((category) => (
								<option key={category.id} value={category._id}>
									{category.name}
								</option>
							))
						) : (
							<option>No Categories Available</option>
						)}
					</select>

					{/* Furniture Type Dropdown */}
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
					{/* Stocks Input */}
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
					{/* Materials Checkbox Section */}
					<div className="mb-4">
						<label className="block font-semibold">Materials:</label>
						<div className="flex flex-col space-y-2">
							{materials.map((material) => (
								<label key={material._id} className="flex items-center">
									<input
										type="checkbox"
										name="material"
										value={material.name} // Assuming the material object has a 'name' property
										checked={newFurniture.materials.includes(material.name)}
										onChange={handleInputChange}
										className="mr-2 h-4 w-4 border rounded text-blue-600 focus:ring-blue-500"
									/>
									<span className="text-gray-700">
										{material.name.charAt(0).toUpperCase() +
											material.name.slice(1)}
									</span>
								</label>
							))}
						</div>
					</div>
					{/* Colors Checkbox Section */}
					<div className="mb-4">
						<label className="block font-semibold">Colors:</label>
						<div className="flex flex-col space-y-2">
							{colors.map((color) => (
								<label key={color._id} className="flex items-center">
									<input
										type="checkbox"
										name="color"
										value={color.name} // Assuming the color object has a 'name' property
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
					{/* Sizes Checkbox Section */}
					<div className="mb-4">
						<label className="block font-semibold">Sizes:</label>
						<div className="flex flex-col space-y-2">
							{sizes.map((size) => (
								<label key={size._id} className="flex items-center">
									<input
										type="checkbox"
										name="size"
										value={size.label} // Assuming the size object has a 'label' property
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
					<button type="submit" className="bg-blue-500 text-white p-2 rounded">
						Add Product
					</button>
				</form>
				{/* Products Table */}
				{/* Products Table */}
				<div className="w-2/3 ml-4 overflow-auto">
					{noFurnitureFound ? (
						<div className="text-center p-8 bg-gray-50 rounded-lg">
							<h3 className="text-xl font-semibold text-gray-600 mb-2">
								No Furniture Available
							</h3>
							<p className="text-gray-500">
								There are currently no furniture items in the database. Add new
								items using the form.
							</p>
						</div>
					) : (
						<table className="min-w-full bg-white border border-collapse">
							<thead>
								<tr>
									<th className="border px-4 py-2">Image</th>
									<th className="border px-4 py-2">Name</th>
									<th className="border px-4 py-2">Category</th>
									<th className="border px-4 py-2">Type</th>
									<th className="border px-4 py-2">Description</th>
									<th className="border px-4 py-2">Materials</th>
									<th className="border px-4 py-2">Colors</th>
									<th className="border px-4 py-2">Sizes</th>
									<th className="border px-4 py-2">Stocks</th>
									<th className="border px-4 py-2">Price</th>
									<th className="border px-4 py-2">Actions</th>
								</tr>
							</thead>
							<tbody>
								{furnitures.map((furniture) => (
									<tr key={furniture._id}>
										<td className="border px-4 py-2">
											<img
												src={`data:image/jpeg;base64,${furniture.image}`}
												alt={furniture.name}
												className="w-16 h-16 object-cover"
											/>
										</td>
										<td className="border px-4 py-2">{furniture.name}</td>
										<td className="border px-4 py-2">
											{furniture.category.name}
										</td>
										<td className="border px-4 py-2">
											{furniture.furnitureType.name}
										</td>
										<td className="border px-4 py-2">
											{furniture.description}
										</td>
										<td className="border px-4 py-2">
											{furniture.materials.map((material) => (
												<span key={material._id} className="mr-2">
													{material.name}
												</span>
											))}
										</td>
										<td className="border px-4 py-2">
											{furniture.colors.map((color) => (
												<span key={color._id} className="mr-2">
													{color.name}
												</span>
											))}
										</td>
										<td className="border px-4 py-2">
											{furniture.sizes.map((size) => (
												<span key={size._id} className="mr-2">
													{size.label}
												</span>
											))}
										</td>
										<td className="border px-4 py-2">{furniture.stocks}</td>
										<td className="border px-4 py-2">{furniture.price} PHP</td>
										<td className="border px-4 py-2">
											<button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
												Edit
											</button>
											<button className="bg-red-500 text-white px-2 py-1 rounded">
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductManagement;
