import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditProduct = () => {
	const { furnitureId } = useParams();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [isFetching, setIsFetching] = useState(true);
	const [categories, setCategories] = useState([]);
	const [furnitureTypes, setFurnitureTypes] = useState([]);
	const [materials, setMaterials] = useState([]);
	const [colors, setColors] = useState([]);
	const [sizes, setSizes] = useState([]);

	const [furnitureData, setFurnitureData] = useState({
		images: [],
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
	const [originalData, setOriginalData] = useState({}); // Store original data
	const [imageFiles, setImageFiles] = useState([]);
	const [previewImages, setPreviewImages] = useState([]);

	useEffect(() => {
		const fetchAllData = async () => {
			setIsFetching(true);
			try {
				// Fetch all data in parallel
				const [
					furnitureResponse,
					categoriesResponse,
					furnitureTypesResponse,
					materialsResponse,
					colorsResponse,
					sizesResponse,
				] = await Promise.all([
					fetch(`http://localhost:3000/api/furnitures/${furnitureId}`, {
						credentials: "include",
					}),
					fetch("http://localhost:3000/api/categories"),
					fetch("http://localhost:3000/api/furniture-types"),
					fetch("http://localhost:3000/api/materials"),
					fetch("http://localhost:3000/api/colors"),
					fetch("http://localhost:3000/api/sizes"),
				]);

				// Check if all responses are ok
				if (
					!furnitureResponse.ok ||
					!categoriesResponse.ok ||
					!furnitureTypesResponse.ok ||
					!materialsResponse.ok ||
					!colorsResponse.ok ||
					!sizesResponse.ok
				) {
					throw new Error("Failed to fetch data");
				}

				// Parse all responses
				const [
					furnitureData,
					categoriesData,
					furnitureTypesData,
					materialsData,
					colorsData,
					sizesData,
				] = await Promise.all([
					furnitureResponse.json(),
					categoriesResponse.json(),
					furnitureTypesResponse.json(),
					materialsResponse.json(),
					colorsResponse.json(),
					sizesResponse.json(),
				]);

				// Set the fetched data to state
				setCategories(categoriesData);
				setFurnitureTypes(furnitureTypesData);
				setMaterials(materialsData);
				setColors(colorsData);
				setSizes(sizesData);

				// Transform the furniture data
				const transformedData = {
					name: furnitureData.name,
					description: furnitureData.description,
					price: furnitureData.price,
					stocks: furnitureData.stocks.stocks,
					category: furnitureData.category.name,
					furnitureType: furnitureData.furnitureType.name,
					materials:
						furnitureData.materials?.map((material) => material.name) || [],
					colors: furnitureData.colors?.map((color) => color.name) || [],
					sizes: furnitureData.sizes?.map((size) => size.label) || [],
					images: furnitureData.images || [],
				};

				setFurnitureData(transformedData);
				setOriginalData(transformedData);

				// Handle images
				if (furnitureData.images && furnitureData.images.length > 0) {
					const imageUrls = furnitureData.images.map((img) =>
						img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}`
					);
					setPreviewImages(imageUrls);
				}

				toast.success("Product data loaded successfully");
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Failed to load data");
			} finally {
				setIsFetching(false);
			}
		};

		fetchAllData();
	}, [furnitureId]);

	const handleMultipleSelect = (field, value) => {
		setFurnitureData((prevData) => {
			const currentValues = prevData[field];
			const newValues = currentValues.includes(value)
				? currentValues.filter((v) => v !== value)
				: [...currentValues, value];

			return {
				...prevData,
				[field]: newValues,
			};
		});
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFurnitureData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleArrayInputChange = (e, field) => {
		const values = e.target.value
			.split(",")
			.map((item) => item.trim())
			.filter((item) => item);
		setFurnitureData((prevData) => ({
			...prevData,
			[field]: values,
		}));
	};

	const handleImageChange = (e) => {
		const files = Array.from(e.target.files);
		setImageFiles((prevFiles) => [...prevFiles, ...files]);
		const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
		setPreviewImages((prevPreviews) => [...prevPreviews, ...newPreviewUrls]);
	};

	const removeImage = (index) => {
		setPreviewImages((prev) => prev.filter((_, i) => i !== index));
		setImageFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			if (previewImages.length < 5) {
				toast.error("At least 5 images are required!");
				return;
			}
			const formData = new FormData();
			// Append only modified fields to formData
			Object.keys(furnitureData).forEach((key) => {
				if (furnitureData[key] !== originalData[key]) {
					if (Array.isArray(furnitureData[key])) {
						furnitureData[key].forEach((value) => {
							formData.append(key, value);
						});
					} else {
						formData.append(key, furnitureData[key]);
					}
				}
			});
			// Append new image files
			imageFiles.forEach((file) => {
				formData.append("images", file);
			});

			console.log("Form data", formData);

			const response = await fetch(
				`http://localhost:3000/api/furnitures/edit/${furnitureId}`,
				{
					method: "PUT",
					body: formData,
					credentials: "include",
				}
			);

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || "Failed to update product");
			}
			toast.success("Product updated successfully!");
			navigate(-1);
		} catch (error) {
			toast.error(error.message || "Failed to update product");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	if (isFetching) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-xl text-gray-600">Loading product data...</div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
			<h2 className="text-2xl font-semibold mb-6 text-gray-800">
				Edit Product
			</h2>
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Image Upload Section */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Product Images (Minimum 5 required)
					</label>
					<div className="grid grid-cols-3 gap-4 mb-4">
						{previewImages.map((preview, index) => (
							<div key={index} className="relative">
								<img
									src={preview}
									alt={`Preview ${index}`}
									className="w-full h-32 object-cover rounded"
								/>
								<button
									type="button"
									onClick={() => removeImage(index)}
									className="absolute top-1 right-1 text-red-700 text-3xl rounded-full p-1 hover:bg-red-600 focus:outline-none"
								>
									×
								</button>
							</div>
						))}
					</div>
					<input
						type="file"
						multiple
						accept="image/*"
						onChange={handleImageChange}
						className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
					/>
					<p className="mt-2 text-sm text-gray-500">
						Current images: {previewImages.length} (Minimum 5 required)
					</p>
				</div>
				{/* Product Details Section */}
				<div className="grid grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Name
						</label>
						<input
							type="text"
							name="name"
							value={furnitureData.name}
							onChange={handleInputChange}
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
						/>
					</div>
					<select
						name="category"
						value={furnitureData.category}
						onChange={handleInputChange}
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
					>
						<option value="">Select Category</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
					<select
						name="furnitureType"
						value={furnitureData.furnitureType}
						onChange={handleInputChange}
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
					>
						<option value="">Select Furniture Type</option>
						{furnitureTypes.map((type) => (
							<option key={type.id} value={type.id}>
								{type.name}
							</option>
						))}
					</select>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Price
						</label>
						<input
							type="number"
							name="price"
							value={furnitureData.price}
							onChange={handleInputChange}
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Stock
						</label>
						<input
							type="number"
							name="stocks"
							value={furnitureData.stocks}
							onChange={handleInputChange}
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
						/>
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Description
					</label>
					<textarea
						name="description"
						value={furnitureData.description}
						onChange={handleInputChange}
						rows="4"
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
					/>
				</div>
				<div className="space-y-6">
					{/* Materials Selection */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-3">
							Materials
						</label>
						<div className="grid grid-cols-3 gap-4">
							{materials.map((material) => (
								<div
									key={material.id}
									className="flex items-center space-x-2 bg-white border rounded-md p-3 hover:bg-gray-50"
								>
									<input
										type="checkbox"
										id={`material-${material.id}`}
										checked={furnitureData.materials.includes(material.name)}
										onChange={() =>
											handleMultipleSelect("materials", material.name)
										}
										className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
									/>
									<label
										htmlFor={`material-${material.id}`}
										className="text-sm text-gray-700 cursor-pointer"
									>
										{material.name}
									</label>
								</div>
							))}
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-3">
							Colors
						</label>
						<div className="grid grid-cols-3 gap-4">
							{colors.map((color) => (
								<div
									key={color.id}
									className="flex items-center space-x-2 bg-white border rounded-md p-3 hover:bg-gray-50"
								>
									<input
										type="checkbox"
										id={`color-${color.id}`}
										checked={furnitureData.colors.includes(color.name)}
										onChange={() => handleMultipleSelect("colors", color.name)}
										className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
									/>
									<label
										htmlFor={`color-${color.id}`}
										className="text-sm text-gray-700 cursor-pointer"
									>
										{color.name}
									</label>
								</div>
							))}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">
								Sizes
							</label>
							<div className="grid grid-cols-3 gap-4">
								{sizes.map((size) => (
									<div
										key={size.id}
										className="flex items-center space-x-2 bg-white border rounded-md p-3 hover:bg-gray-50"
									>
										<input
											type="checkbox"
											id={`size-${size.id}`}
											checked={furnitureData.sizes.includes(size.label)}
											onChange={() => handleMultipleSelect("sizes", size.label)}
											className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
										/>
										<label
											htmlFor={`size-${size.id}`}
											className="text-sm text-gray-700 cursor-pointer"
										>
											{size.label}
										</label>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="flex gap-4">
					<button
						type="submit"
						disabled={isLoading}
						className={`flex-1 bg-indigo-600 text-white font-medium py-3 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
							isLoading ? "opacity-50 cursor-not-allowed" : ""
						}`}
					>
						{isLoading ? "Updating..." : "Update Product"}
					</button>
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="flex-1 bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditProduct;
