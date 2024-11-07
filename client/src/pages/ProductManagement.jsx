import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const ProductManagement = () => {
	const [loading, setLoading] = useState(true);
	const [furnitureData, setFurnitureData] = useState([]);
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
		images: [],
		name: "",
		category: "",
		furnitureType: "",
		description: "",
		materials: [],
		colors: [],
		sizes: [],
		price: "",
	});

	const fetchData = async () => {
		setLoading(true);
		try {
			const [
				furnitureResponse,
				furnitureTypesResponse,
				categoriesResponse,
				materialsResponse,
				colorsResponse,
				sizesResponse,
			] = await Promise.all([
				fetch("http://localhost:3000/api/furnitures", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}),
				fetch("http://localhost:3000/api/furniture-types",{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}),
				fetch("http://localhost:3000/api/categories",{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}),
				fetch("http://localhost:3000/api/materials",{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}),
				fetch("http://localhost:3000/api/colors",{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}),
				fetch("http://localhost:3000/api/sizes",{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}),
			]);

			if (furnitureResponse.ok) {
				const furnitureData = await furnitureResponse.json();
				setFurnitureData(furnitureData || []);
			} else {
				throw new Error(furnitureResponse.message || furnitureResponse.error);
			}

			if (furnitureTypesResponse.ok) {
				const furnitureTypesData = await furnitureTypesResponse.json();
				setFurnitureTypes(furnitureTypesData || []);
			} else {
				throw new Error("Failed to fetch furniture types");
			}

			if (categoriesResponse.ok) {
				const categoriesData = await categoriesResponse.json();
				setCategories(categoriesData || []);
			} else {
				throw new Error("Failed to fetch categories");
			}

			if (materialsResponse.ok) {
				const materialsData = await materialsResponse.json();
				setMaterials(materialsData || []);
			} else {
				throw new Error("Failed to fetch materials");
			}

			if (colorsResponse.ok) {
				const colorsData = await colorsResponse.json();
				setColors(colorsData || []);
			} else {
				throw new Error("Failed to fetch colors");
			}

			if (sizesResponse.ok) {
				const sizesData = await sizesResponse.json();
				setSizes(sizesData || []);
			} else {
				throw new Error("Failed to fetch sizes");
			}
		} catch (error) {
			console.error("Error fetching data:", error.message);
			toast.error("Failed to fetch data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
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
		if (name === "price" && value < 0) {
			toast.error("Price cannot be negative");
			return;
		}
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
		const files = Array.from(e.target.files);

		if (files.length > 5) {
			toast.error("You can only upload a maximum of 5 images.");
			return;
		}

		const readFileAsDataURL = (file) => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					resolve(reader.result.split(",")[1]); // Get base64 data
				};
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
		};

		Promise.all(files.map(readFileAsDataURL))
			.then((base64Images) => {
				setNewFurniture((prev) => ({
					...prev,
					images: base64Images,
				}));
			})
			.catch((error) => {
				console.error("Error reading files:", error);
				toast.error("Failed to read files");
			});
	};

	// const handleFileChange = (e) => {
	// 	const files = Array.from(e.target.files);
	
	// 	if (files.length > 5) {
	// 		toast.error("You can only upload a maximum of 5 images.");
	// 		return;
	// 	}
	
	// 	setNewFurniture((prev) => ({
	// 		...prev,
	// 		images: files, // store the selected files directly
	// 	}));
	// };
	
	const handleSubmit = async (e) => {
		e.preventDefault();
	
		const formData = new FormData();
		// Append all fields to the FormData object
		formData.append("name", newFurniture.name);
		formData.append("category", newFurniture.category);
		formData.append("furnitureType", newFurniture.furnitureType);
		formData.append("description", newFurniture.description);
		formData.append("price", newFurniture.price);
	
		// Append materials, colors, and sizes (arrays)
		newFurniture.materials.forEach((material) => {
			formData.append("materials[]", material);
		});
		newFurniture.colors.forEach((color) => {
			formData.append("colors[]", color);
		});
		newFurniture.sizes.forEach((size) => {
			formData.append("sizes[]", size);
		});
	
		// Append each image to FormData (files)
		newFurniture.images.forEach((file, index) => {
			formData.append("images", file); // "images" is the field name in the backend
		});
	
		try {
			const response = await fetch("http://localhost:3000/api/furnitures/add", {
				method: "POST",
				headers: {
					// "Content-Type": "multipart/form-data", <-- do not set this manually
				},
				credentials: "include",
				body: formData,
			});
	
			if (response.ok) {
				const data = await response.json();
				toast.success(data.message);
				setNewFurniture({
					images: [],
					name: "",
					category: "",
					furnitureType: "",
					description: "",
					materials: [],
					colors: [],
					sizes: [],
					price: "",
				});
				fetchData();
			} else {
				const errorData = await response.json(); // Make sure the server returns JSON even on error
				toast.error(errorData.message || "Failed to add furniture");
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
			{loading ? (
				<div className="flex justify-center items-center h-64">
					<ClipLoader loading={loading} size={50} color="#007bff" />
				</div>
			) : (
				<div className="flex flex-row justify-center">
					<form onSubmit={handleSubmit} className="mb-6 space-y-4 w-1/2">
						<select
							id="category"
							name="category"
							value={selectedCategory}
							onChange={handleCategoryChange}
							required
							className="border rounded p-2 w-full"
						>
							<option value="">Select Category</option>
							{Array.isArray(categories) &&
								categories.map((category) => (
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
							min="0"
							className="border rounded p-2 w-full"
						/>

						<div className="mt-4 mb-4 bg-slate-200 rounded-md px-5 py-2">
							<label className="block font-semibold">Materials:</label>
							<div className="flex flex-wrap">
								{Array.isArray(materials) && materials.length > 0 ? (
									materials.map((material) => (
										<label
											key={material._id}
											className="flex items-center w-1/3 p-2"
										>
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
									))
								) : (
									<span className="text-gray-500">No materials available</span>
								)}
							</div>
						</div>

						{/* Colors */}
						<div className="mt-4 mb-4 bg-slate-200 rounded-md px-5 py-2">
							<label className="block font-semibold">Colors:</label>
							<div className="flex flex-wrap">
								{Array.isArray(colors) && colors.length > 0 ? (
									colors.map((color) => (
										<label
											key={color._id}
											className="flex items-center w-1/3 p-2"
										>
											<input
												type="checkbox"
												name="color"
												value={color.name}
												checked={newFurniture.colors.includes(color.name)}
												onChange={handleInputChange}
												className="mr-2 h-4 w-4 border rounded text-blue-600 focus:ring-blue-500"
											/>
											<span className="text-gray-700 mr-2">
												{color.name.charAt(0).toUpperCase() +
													color.name.slice(1)}
											</span>
											<div
												className="h-4 w-4 border rounded"
												style={{ backgroundColor: color.hex }}
											/>
										</label>
									))
								) : (
									<span className="text-gray-500">No colors available</span>
								)}
							</div>
						</div>

						{/* Sizes */}
						<div className="mb-4 bg-slate-200 rounded-md p-2">
							<label className="block font-semibold my-2 mb-2">
								Sizes: (Height X Width X Length X Depth)
							</label>
							<div className="flex flex-wrap">
								{filteredSizes.length > 0 ? (
									filteredSizes.map((size) => (
										<label
											key={size._id}
											className="flex items-center w-1/3 p-2"
										>
											<input
												type="checkbox"
												name="sizes"
												value={size.label}
												checked={newFurniture.sizes.includes(size.label)}
												onChange={handleInputChange}
												className="mr-2 h-4 w-4 border rounded text-blue-600 focus:ring-blue-500"
											/>
											<span className="text-gray-700">
												{size.label.charAt(0).toUpperCase() +
													size.label.slice(1)}{" "}
												<span className="text-gray-500 italic">
													( {size.height} X {size.width} X {size.length} X{" "}
													{size.depth} )
												</span>
											</span>
										</label>
									))
								) : (
									<p className="text-gray-500">No sizes available</p>
								)}
							</div>
						</div>
						{/* IMAGE INPUT  */}
						<div className="mt-4">
							<label className="block font-semibold">Selected Images:</label>
							<div className="flex flex-wrap gap-4">
								{Array.isArray(newFurniture.images) &&
									newFurniture.images.length > 0 &&
									newFurniture.images.map((image, index) => (
										<img
											key={index}
											src={`data:image/jpeg;base64,${image}`}
											alt={`Selected image ${index + 1}`}
											className="w-16 h-16 object-contain"
										/>
									))}
							</div>
						</div>
						<input
							id="images"
							type="file"
							name="images"
							onChange={handleFileChange}
							required
							className="border rounded p-2 w-full"
							multiple
							accept="image/*"
						/>
						<button
							onClick={handleSubmit}
							type="submit"
							className="bg-blue-500 text-white p-2 rounded w-full"
						>
							Add Product
						</button>
					</form>
				</div>
			)}
			{/* Table to display furniture data */}
			<div className="mt-8 overflow-x-auto">
				<h2 className="text-2xl font-bold mb-4">Furniture List</h2>
				<table className="min-w-full border-collapse border border-gray-200">
					<thead>
						<tr className="bg-gray-100">
							<th className="border border-gray-300 p-2">Furniture Id</th>
							<th className="border border-gray-300 p-2">Image</th>
							<th className="border border-gray-300 p-2">Name</th>
							<th className="border border-gray-300 p-2">Category</th>
							<th className="border border-gray-300 p-2">Description</th>
							<th className="border border-gray-300 p-2">Type</th>
							<th className="border border-gray-300 p-2">Colors</th>
							<th className="border border-gray-300 p-2">
								Sizes <br /> (Height X Width X Depth)
							</th>
							<th className="border border-gray-300 p-2">Materials</th>
							<th className="border border-gray-300 p-2">Price</th>
						</tr>
					</thead>
					<tbody>
						{furnitureData.length > 0 ? (
							furnitureData.map((furniture) => (
								<tr
									key={furniture._id}
									className="hover:bg-gray-50 transition-colors"
								>
									<td className="border border-gray-300 p-2">
										{furniture._id}
									</td>
									<td className="border border-gray-300 p-2 flex justify-center">
										{furniture.images.length > 0 ? (
											<img
												src={`data:image/jpeg;base64,${furniture.images[0]}`} // Display only the first image
												alt={furniture.name}
												className="w-16 h-16 object-cover rounded-md"
											/>
										) : (
											<span className="text-gray-500">No Image</span>
										)}
									</td>
									<td className="border border-gray-300 p-2">
										{furniture.name}
									</td>
									<td className="border border-gray-300 p-2">
										{furniture.category?.name || "N/A"}
									</td>
									<td
										className="border border-gray-300 p-2"
										title={furniture.description}
									>
										{furniture.description.length > 50
											? `${furniture.description.substring(0, 50)}...`
											: furniture.description}
									</td>
									<td className="border border-gray-300 p-2">
										{furniture.furnitureType?.name || "N/A"}
									</td>
									<td className="border border-gray-300 p-2">
										{furniture.colors && furniture.colors.length > 0
											? furniture.colors.map((color) => (
													<span key={color._id} className="block">
														{color.name}
													</span>
											  ))
											: "N/A"}
									</td>
									<td className="border border-gray-300 p-2">
										{furniture.sizes && furniture.sizes.length > 0
											? furniture.sizes.map((size) => (
													<span key={size._id} className="block">
														{size.label} <br /> ({size.height} X {size.width} X{" "}
														{size.depth} )
													</span>
											  ))
											: "N/A"}
									</td>
									<td className="border border-gray-300 p-2">
										{furniture.materials && furniture.materials.length > 0
											? furniture.materials.map((material) => (
													<span key={material._id} className="block">
														{material.name}
													</span>
											  ))
											: "N/A"}
									</td>
									<td className="border border-gray-300 p-2">
										{furniture.price}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan="11"
									className="text-center p-4 text-gray-500 font-semibold"
								>
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
