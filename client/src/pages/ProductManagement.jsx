import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductManagement = () => {
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedFurnitureType, setSelectedFurnitureType] = useState("");
	const [categories, setCategories] = useState([]);
	const [filteredFurnitureTypes, setFilteredFurnitureTypes] = useState([]);
	const [filteredSizes, setFilteredSizes] = useState([]);
	const [furnitureTypes, setFurnitureTypes] = useState([]);
	const [materials, setMaterials] = useState([]);
	const [colors, setColors] = useState([]);
	const [sizes, setSizes] = useState([]);
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
	const [furnitureData, setFurnitureData] = useState([]); // State for furniture data

	const fetchFurnitureData = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/furnitures");
			if (!response.ok) {
				throw new Error("Failed to fetch furniture data");
			}
			const data = await response.json();
			// console.log(data); // Log the data to check its structure
			setFurnitureData(data.furnitures || []); // Set fetched furniture data
			setCategories(data.categories || []);
			setMaterials(data.materials || []);
			setColors(data.colors || []);
			setSizes(data.sizes || []);
		} catch (error) {
			console.error("Error fetching furniture data:", error);
			toast.error("Error fetching furniture data");
		}
	};

	const fetchFurnitureTypes = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/furniture-types");
			if (!response.ok) {
				throw new Error("Failed to fetch furniture types");
			}
			const data = await response.json();
			setFurnitureTypes(data || []);
		} catch (error) {
			console.error("Error fetching furniture types:", error);
			toast.error("Error fetching furniture types:");
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/categories");
			if (!response.ok) {
				throw new Error("Failed to fetch categories");
			}
			const data = await response.json();
			setCategories(data || []);
		} catch (error) {
			console.error("Error fetching categories types:", error);
			toast.error("Error fetching categories types");
		}
	};

	const fetchMaterials = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/materials");
			if (!response.ok) {
				throw new Error("Failed to fetch categories");
			}
			const data = await response.json();
			setMaterials(data || []);
		} catch (error) {
			console.error("Error fetching categories types:", error);
			toast.error("Error fetching categories types");
		}
	};

	const fetchColors = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/colors");
			if (!response.ok) {
				throw new Error("Failed to fetch colors");
			}
			const data = await response.json();
			setColors(data || []);
		} catch (error) {
			console.error("Error fetching colors :", error);
			toast.error("Error fetching colors");
		}
	};

	const fetchSizes = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/sizes");
			if (!response.ok) {
				throw new Error("Failed to fetch sizes");
			}
			const data = await response.json();
			setSizes(data || []);
		} catch (error) {
			console.error("Error fetching sizes :", error);
			toast.error("Error fetching sizes");
		}
	};

	useEffect(() => {
		fetchFurnitureData();
		fetchFurnitureTypes();
		fetchCategories();
		fetchMaterials();
		fetchColors();
		fetchSizes();
	}, []);

	const handleCategoryChange = (e) => {
		const categoryId = e.target.value;
		setSelectedCategory(categoryId);
		setNewFurniture((prev) => ({
			...prev,
			category: categoryId,
			furnitureType: "",
		}));
		setSelectedFurnitureType("");
		const filteredTypes = furnitureTypes.filter(
			(type) => type.categoryId === categoryId
		);
		setFilteredFurnitureTypes(filteredTypes);
	};

	const handleFurnitureTypeChange = (e) => {
		const furnitureTypeId = e.target.value;
		setSelectedFurnitureType(furnitureTypeId);
		setNewFurniture((prev) => ({
			...prev,
			furnitureType: furnitureTypeId,
		}));
		const filtered = sizes.filter(
			(size) => size.furnitureTypeId === furnitureTypeId
		);
		setFilteredSizes(filtered);
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
			} else if (name === "sizes") {
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:3000/api/furnitures/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					image: newFurniture.image,
					name: newFurniture.name,
					category: newFurniture.category,
					furnitureType: newFurniture.furnitureType,
					description: newFurniture.description,
					materials: newFurniture.materials,
					colors: newFurniture.colors,
					sizes: newFurniture.sizes,
					stocks: newFurniture.stocks,
					price: newFurniture.price,
				}),
			});
			if (response.ok) {
				const data = await response.json();
				toast.success(data.message);
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
				await fetchFurnitureData(); // Refresh furniture data
			} else {
				const errorData = await response.json();
				toast.error(errorData.message);
			}
		} catch (error) {
			console.error("Error adding new Furniture:", error);
			toast.error("Failed to add new Furniture");
		}
	};
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6 text-center">
				Product Management
			</h1>
			<div className="flex flex-row justify-center">
				<form onSubmit={handleSubmit} className="mb-6 space-y-4 w-1/2">
					{/* Form fields remain unchanged */}
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
						{filteredFurnitureTypes.map((furnitureType) => (
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
					{/* Materials, Colors, Sizes checkboxes remain unchanged */}
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
										{material.name.charAt(0).toUpperCase() +
											material.name.slice(1)}
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
							{filteredSizes.length > 0 ? (
								filteredSizes.map((size) => (
									<label key={size._id} className="flex items-center">
										<input
											type="checkbox"
											name="sizes"
											value={size.label}
											checked={newFurniture.sizes.includes(size.label)}
											onChange={handleInputChange}
											className="mr-2 h-4 w-4 border rounded text-blue-600 focus:ring-blue-500"
										/>
										<span className="text-gray-700">
											{size.label.charAt(0).toUpperCase() + size.label.slice(1)}
										</span>
									</label>
								))
							) : (
								<p className="text-gray-500">No sizes available</p>
							)}
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
					<button
						type="submit"
						className="bg-blue-500 text-white p-2 rounded w-full"
					>
						Add Product
					</button>
				</form>
			</div>
			{/* Table to display furniture data */}
			<div className="mt-8">
				<h2 className="text-2xl font-bold mb-4">Furniture List</h2>
				<table className="min-w-full border-collapse border border-gray-200">
					<thead>
						<tr className="bg-gray-100">
							<th className="border border-gray-300 p-2">Image</th>
							<th className="border border-gray-300 p-2">Name</th>
							<th className="border border-gray-300 p-2">Category</th>
							<th className="border border-gray-300 p-2">Type</th>
							<th className="border border-gray-300 p-2">Sizes</th>
							<th className="border border-gray-300 p-2">Price</th>
							<th className="border border-gray-300 p-2">Stocks</th>
							<th className="border border-gray-300 p-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{furnitureData && furnitureData.length > 0 ? (
							furnitureData.map((furniture) => (
								<tr key={furniture._id}>
									<td className="border border-gray-300 p-2">
										<img
											src={`data:image/jpeg;base64,${furniture.image}`}	
											alt={furniture.name}
											className="w-16 h-16 object-cover"
										/>
									</td>
									<td className="border border-gray-300 p-2">
										{furniture.name}
									</td>
									<td className="border border-gray-300 p-2">
										{furniture.category.name}
									</td>
									<td className="border border-gray-300 p-2">
										{furniture.furnitureType}
									</td>
									<td className="border border-gray-300 p-2">
										{furniture.sizes.join(", ")}
									</td>
									<td className="border border-gray-300 p-2">
										{furniture.price}
									</td>
									<td className="border border-gray-300 p-2">
										{furniture.stocks}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="7" className="text-center p-4">
									No furniture available
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<ToastContainer />
		</div>
	);
};

export default ProductManagement;
