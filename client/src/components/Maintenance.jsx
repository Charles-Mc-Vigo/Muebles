import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Table = ({
	headers,
	data,
	onEdit,
	onSave,
	onArchive,
	categoriesList,
}) => {
	const [editIndex, setEditIndex] = useState(null);

	const handleEditClick = (index) => {
		setEditIndex(index);
	};

	const handleSaveClick = (row) => {
		onSave(row);
		setEditIndex(null);
	};

	return (
		<table className="min-w-full border-collapse border border-gray-300 mb-6">
			<thead className="bg-gray-200">
				<tr>
					{headers.map((header, index) => (
						<th
							key={index}
							className="border border-gray-300 p-2 text-left font-semibold text-gray-700"
						>
							{header}
						</th>
					))}
					<th className="border border-gray-300 p-2 text-left font-semibold text-gray-700">
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				{data.map((row, rowIndex) => (
					<tr
						key={rowIndex}
						className="hover:bg-gray-100 transition-colors duration-200"
					>
						{/* Filter out 'id' when mapping through row keys */}
						{Object.keys(row)
							.filter((key) => key !== "id")
							.map((key, cellIndex) => (
								<td key={cellIndex} className="border border-gray-300 p-2">
									{editIndex === rowIndex ? (
										key === "category" ? (
											<select
												value={row.categoryId || ""}
												onChange={(e) =>
													onEdit(rowIndex, "categoryId", e.target.value)
												}
												className="w-full border rounded-lg p-1"
											>
												<option value="">Select a Category</option>
												{categoriesList &&
													categoriesList.map((category) => (
														<option key={category._id} value={category._id}>
															{category.name}
														</option>
													))}
											</select>
										) : (
											<input
												type="text"
												value={row[key] || ""}
												onChange={(e) => onEdit(rowIndex, key, e.target.value)}
												className="w-full border rounded-lg p-1"
											/>
										)
									) : (
										row[key] || ""
									)}
								</td>
							))}

						<td className="border border-gray-300 p-2 flex space-x-2">
							{editIndex === rowIndex ? (
								<button
									onClick={() => handleSaveClick(row)}
									className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
								>
									Save
								</button>
							) : (
								<button
									onClick={() => handleEditClick(rowIndex)}
									className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
								>
									Edit
								</button>
							)}
							<button
								onClick={() => {
									const confirmArchive = window.confirm(
										"Are you sure you want to archive this item?"
									);
									if (confirmArchive) {
										onArchive(row.id); // Pass row.id to onArchive without displaying it
									}
								}}
								className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
							>
								Archive
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

const Maintenance = () => {
	const initialSizeState = {
		label: "",
		height: "",
		width: "",
		depth: "",
		furnitureTypeId: "",
	};
	const initialColorState = {
		name: "",
		rgb: "",
		hex: "",
	};

	const [categories, setCategories] = useState([]);
	const [furnitureTypes, setFurnitureTypes] = useState([]);
	const [colors, setColors] = useState([]);
	const [sizes, setSizes] = useState([]);
	const [materials, setMaterials] = useState([]);
	const [newMaterial, setNewMaterial] = useState({ name: "", stocks: "" });
	const [selectedFilter, setSelectedFilter] = useState("");
	const [selectedFurnitureType, setSelectedFurnitureType] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [newItemName, setNewItemName] = useState("");
	const [ect, setECT] = useState("");
	const [newSize, setNewSize] = useState(initialSizeState);
	const [newColor, setNewColor] = useState(initialColorState);

	const fetchData = async () => {
		await fetchCategories();
		await fetchFurnitureTypes();
		await fetchColors();
		await fetchSizes();
		await fetchMaterials();
	};
	useEffect(() => {
		fetchData();
	}, []);

	const fetchMaterials = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/materials", {
				method: "GET",
				credentials: "include",
			});
			const data = await response.json();
			setMaterials(data);
		} catch (error) {
			console.error("Error fetching materials:", error);
			toast.error("Failed to fetch materials");
		}
	};

	const fetchFurnitureTypes = async () => {
		try {
			const response = await fetch(
				"http://localhost:3000/api/furniture-types",
				{
					method: "GET",
					credentials: "include",
				}
			);
			const data = await response.json();
			setFurnitureTypes(data);
		} catch (error) {
			console.error("Error fetching furniture types:", error);
		}
	};
	const handleArchive = async (entityType, entityId) => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/${entityType}/archive/${entityId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to archive ${entityType} with ID: ${entityId}`);
			}

			toast.success(`Successfully archived ${entityType}`);
			console.log(`${entityType} with ID ${entityId} archived successfully`);

			// Optionally, update the UI by removing or updating the entity in the respective state
			switch (entityType) {
				case "sizes":
					setSizes((prevSizes) =>
						prevSizes.filter((size) => size._id !== entityId)
					);
					break;
				case "categories":
					setCategories((prevCategories) =>
						prevCategories.filter((category) => category._id !== entityId)
					);
					break;
				case "furniture-types":
					setFurnitureTypes((prevTypes) =>
						prevTypes.filter((type) => type._id !== entityId)
					);
					break;
				case "colors":
					setColors((prevColors) =>
						prevColors.filter((color) => color._id !== entityId)
					);
					break;
				case "materials":
					setMaterials((prevMaterials) =>
						prevMaterials.filter((material) => material._id !== entityId)
					);
					break;
				default:
					break;
			}
		} catch (error) {
			console.error("Error archiving:", error);
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/categories", {
				method: "GET",
				credentials: "include",
			});
			const data = await response.json();
			setCategories(data);
			console.log(data);
		} catch (error) {
			setCategories([]);
			console.error("Failed to fetch categories:", error);
		}
	};

	const fetchColors = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/colors", {
				method: "GET",
				credentials: "include",
			});
			const data = await response.json();
			setColors(data);
		} catch (error) {
			console.error("Failed to fetch colors:", error);
		}
	};

	const fetchSizes = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/sizes", {
				method: "GET",
				credentials: "include",
			});
			const data = await response.json();
			setSizes(data);
		} catch (error) {
			console.error("Failed to fetch sizes:", error);
		}
	};

	const handleAddNewMaterial = async () => {
		const { name, stocks } = newMaterial;
		if (!name || !stocks) {
			toast.error("Please provide valid name and stocks.");
			return;
		}
		try {
			const response = await fetch("http://localhost:3000/api/materials/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ name, stocks }),
			});

			if (response.ok) {
				const data = await response.json();
				toast.success("Material added successfully.");
				setNewMaterial({ name: "", stocks: "" }); // Reset input
				await fetchMaterials(); // Refresh the list
			} else {
				const errorData = await response.json();
				toast.error(errorData.message);
			}
		} catch (error) {
			console.error("Error adding material:", error);
			toast.error("Failed to add material");
		}
	};

	const handleAddNewSize = async () => {
		if (!newSize.label || !selectedFurnitureType) {
			toast.error(
				"Please enter a valid size name and select a furniture type."
			);
			return;
		}
		try {
			const response = await fetch("http://localhost:3000/api/sizes/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					label: newSize.label,
					height: newSize.height,
					width: newSize.width,
					depth: newSize.depth,
					furnitureTypeId: selectedFurnitureType,
				}),
			});
			if (response.ok) {
				const data = await response.json();
				toast.success(data.message);
				resetInputFields();
				await fetchSizes();
			} else {
				const errorData = await response.json();
				toast.error(errorData.message);
			}
		} catch (error) {
			console.error("Error adding size:", error);
			toast.error("Failed to add size");
		}
	};

	const handleColorChange = (e) => {
		const { name, value } = e.target;
		setNewColor((prevColor) => ({ ...prevColor, [name]: value }));
	};

	const handleAddNewColor = async () => {
		if (!newColor.name || !newColor.rgb || !newColor.hex) {
			toast.error("Please provide all color details.");
			return;
		}
		try {
			const response = await fetch("http://localhost:3000/api/colors/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					name: newColor.name,
					rgb: newColor.rgb,
					hex: newColor.hex,
				}),
			});
			const data = await response.json();
			if (!response.ok) {
				console.log("Response Error:", data);
				throw new Error(data.message || "Failed to add color.");
			}
			toast.success("Color added successfully.");
			resetInputFields(); // Reset fields after adding color
			await fetchColors(); // Refresh colors list
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleAddNewItem = async () => {
		if (
			!newItemName &&
			selectedFilter !== "Furniture Size" &&
			selectedFilter !== "Colors" &&
			selectedFilter !== "Furniture Materials"
		) {
			toast.error("Please enter a valid name.");
			return;
		}
		try {
			if (selectedFilter === "Categories") {
				const response = await fetch(
					"http://localhost:3000/api/categories/add",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
						body: JSON.stringify({ name: newItemName }),
					}
				);
				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || "Failed to add category.");
				}
				toast.success("Category added successfully.");
				await fetchCategories(); // Refresh categories list
			}
			if (selectedFilter === "Furniture Types") {
				if (!selectedCategory) {
					toast.error("Please select a category.");
					return;
				}
				const response = await fetch(
					"http://localhost:3000/api/furniture-types/add",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
						body: JSON.stringify({
							name: newItemName,
							ECT: ect,
							categoryId: selectedCategory,
						}),
					}
				);
	
				const responseData = await response.json();
				if (!response.ok) {
					throw new Error(responseData.message || "Failed to add furniture type.");
				}
	
				setFurnitureTypes((prevTypes) =>
					Array.isArray(prevTypes)
						? [...prevTypes, responseData.newFurnitureType]
						: [responseData.newFurnitureType]
				);
				toast.success(responseData.message);
				await fetchFurnitureTypes();
			}
	
			resetInputFields();
		} catch (error) {
			toast.error(error.message);
		}
	};
	
	const handleEditItem = (rowIndex, key, value) => {
		const updateItem = (items, setItems) => {
			const updatedItems = [...items];
			// Check if we are editing "Furniture Types"
			if (selectedFilter === "Furniture Types" && key === "categoryId") {
				updatedItems[rowIndex].categoryId = value;
			} else {
				updatedItems[rowIndex][key] = value;
			}
			console.log("Updated Item:", updatedItems[rowIndex]); // Log the updated item
			setItems(updatedItems);
		};

		switch (selectedFilter) {
			case "Categories":
				updateItem(categories, setCategories);
				break;
			case "Furniture Types":
				updateItem(furnitureTypes, setFurnitureTypes);
				break;
			case "Furniture Size":
				updateItem(sizes, setSizes);
				break;
			case "Colors":
				updateItem(colors, setColors);
				break;
			case "Furniture Materials":
				updateItem(materials, setMaterials);
				break;
			default:
				console.error("Unknown filter selected:", selectedFilter);
		}
	};

	const handleSaveItem = async (item) => {
		let url = "";
		if (selectedFilter === "Categories") {
			url = `http://localhost:3000/api/categories/${item.id}`;
		} else if (selectedFilter === "Furniture Types") {
			url = `http://localhost:3000/api/furniture-types/${item.id}`;
		} else if (selectedFilter === "Furniture Size") {
			url = `http://localhost:3000/api/sizes/${item.id}`;
		} else if (selectedFilter === "Colors") {
			url = `http://localhost:3000/api/colors/edit-color/${item.id}`;
		} else if (selectedFilter === "Furniture Materials") {
			url = `http://localhost:3000/api/materials/edit/${item.id}`;
		}

		try {
			const response = await fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(item),
			});
			if (response.ok) {
				toast.success("Item updated successfully.");
				await fetchData(); // Refresh data
			} else {
				const errorData = await response.json();
				toast.error(errorData.message);
			}
		} catch (error) {
			console.error("Error updating item:", error);
			toast.error("Failed to update item");
		}
	};

	const resetInputFields = () => {
		setNewItemName("");
		setNewColor(initialColorState);
		setNewSize(initialSizeState);
		setSelectedFurnitureType("");
		setSelectedCategory("");
	};

	const renderInputField = (
		label,
		name,
		value,
		onChange,
		type = "text",
		placeholder
	) => (
		<div className="mb-4" key={name}>
			<label className="block mb-1 font-semibold text-gray-700">{label}</label>
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				className="w-full border rounded-lg p-2 shadow-sm focus:ring focus:ring-blue-300"
				placeholder={placeholder}
			/>
		</div>
	);

	return (
		<div className="container mx-auto p-6 flex flex-col">
			<h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
				JCKAME Maintenance
			</h1>
			<div className="flex flex-row justify-between">
				{/* Left Side for Form */}
				<div className="w-2/5">
					{" "}
					{/* Set width to 40% */}
					<form
						onSubmit={(e) => {
							e.preventDefault();
							if (selectedFilter === "Furniture Size") {
								handleAddNewSize();
							} else if (selectedFilter === "Colors") {
								handleAddNewColor();
							} else if (selectedFilter === "Furniture Materials") {
								handleAddNewMaterial();
							} else {
								handleAddNewItem();
							}
						}}
						className="mb-6 space-y-4 bg-gray-100 p-4 rounded-lg shadow-md border-3 border-bg-oliveGreen"
					>
						<div className="mb-4">
							<label className="block font-semibold text-2xl m-5">
								Maintenance Options
							</label>
							<select
								value={selectedFilter}
								onChange={(e) => setSelectedFilter(e.target.value)}
								className="w-full border rounded-lg p-2 mb-10 shadow-sm focus:ring focus:ring-blue-300"
							>
								<option value="">-- Select --</option>
								<option value="Categories">Categories</option>
								<option value="Furniture Types">Furniture Types</option>
								<option value="Furniture Size">Furniture Size</option>
								<option value="Furniture Materials">Furniture Materials</option>
								<option value="Colors">Colors</option>
							</select>
						</div>

						{/* Dynamic Input Fields */}
						{selectedFilter === "Categories" &&
							renderInputField(
								"New Category",
								"newCategory",
								newItemName,
								(e) => setNewItemName(e.target.value)
							)}
						{selectedFilter === "Furniture Types" && (
							<>
								<div className="mb-4">
									<label className="block mb-1 font-semibold text-gray-700">
										Select Category
									</label>
									<select
										value={selectedCategory}
										onChange={(e) => setSelectedCategory(e.target.value)}
										className="w-full border rounded-lg p-2 shadow-sm focus:ring focus:ring-blue-300"
									>
										<option value="">-- Select --</option>
										{Array.isArray(categories) &&
											categories.map((category) => (
												<option key={category._id} value={category._id}>
													{category.name}
												</option>
											))}
									</select>
								</div>
								{renderInputField(
									"New Furniture Type",
									"newFurnitureType",
									newItemName,
									(e) => setNewItemName(e.target.value)
								)}
								{renderInputField(
									"Estimated Completion Time (ECT)",
									"ect",
									ect,
									(e) => setECT(e.target.value) // Update ECT state
								)}
							</>
						)}
						{selectedFilter === "Furniture Size" && (
							<>
								<div className="mb-4">
									<label className="block mb-1 font-semibold text-gray-700">
										Select Furniture Type
									</label>
									<select
										value={selectedFurnitureType}
										onChange={(e) => setSelectedFurnitureType(e.target.value)}
										className="w-full border rounded-lg p-2 shadow-sm focus:ring focus:ring-blue-300"
									>
										<option value="">-- Select --</option>
										{Array.isArray(furnitureTypes) &&
											furnitureTypes.map((type) => (
												<option key={type._id} value={type._id}>
													{type.name}
												</option>
											))}
									</select>
								</div>

								{renderInputField("Label", "label", newSize.label, (e) =>
									setNewSize({ ...newSize, label: e.target.value })
								)}
								{renderInputField(
									"Height (inches)",
									"height",
									newSize.height,
									(e) => setNewSize({ ...newSize, height: e.target.value }),
									"number"
								)}
								{renderInputField(
									"Width (inches)",
									"width",
									newSize.width,
									(e) => setNewSize({ ...newSize, width: e.target.value }),
									"number"
								)}
								{renderInputField(
									"Depth (inches)",
									"depth",
									newSize.depth,
									(e) => setNewSize({ ...newSize, depth: e.target.value }),
									"number"
								)}
							</>
						)}
						{selectedFilter === "Colors" && (
							<>
								{renderInputField(
									"Color Name",
									"name",
									newColor.name,
									handleColorChange
								)}
								{renderInputField(
									"RGB Value",
									"rgb",
									newColor.rgb,
									handleColorChange
								)}
								{renderInputField(
									"Hex Value",
									"hex",
									newColor.hex,
									handleColorChange
								)}
							</>
						)}
						{selectedFilter === "Furniture Materials" && (
							<>
								{renderInputField(
									"Material Name",
									"name",
									newMaterial.name,
									(e) =>
										setNewMaterial({ ...newMaterial, name: e.target.value })
								)}
								{renderInputField(
									"Stocks",
									"stocks",
									newMaterial.stocks,
									(e) =>
										setNewMaterial({
											...newMaterial,
											stocks: e.target.value,
										}),
									"number"
								)}
							</>
						)}
						<button
							type="submit"
							className="w-full bg-green-800 text-white rounded-lg p-2 font-semibold hover:bg-green-700 transition duration-200"
						>
							Add New {selectedFilter}
						</button>
					</form>
				</div>
				{/* Right Side for Tables */}
				<div className="w-4/5 pl-4 border-2">
					{selectedFilter === "Categories" && (
						<div className="space-y-4">
							<h2 className="text-2xl font-bold mb-4">Categories</h2>
							<div className="max-h-96 overflow-y-auto">
								<Table
									headers={["Category Name"]}
									data={
										Array.isArray(categories)
											? categories.map((category) => ({
													id: category._id,
													name: category.name,
											  }))
											: []
									}
									onEdit={handleEditItem}
									onSave={handleSaveItem}
									onArchive={(id) => handleArchive("categories", id)} // Pass entity type and ID
								/>
							</div>
						</div>
					)}

					{selectedFilter === "Furniture Types" && (
						<div className="space-y-4">
							<h2 className="text-2xl font-bold mb-4">Furniture Types</h2>
							<div className="max-h-96 overflow-y-auto">
								<Table
									headers={[
										"Furniture Type",
										"Estimated Completion Time (ECT)",
										"Category",
									]}
									data={
										Array.isArray(furnitureTypes)
											? furnitureTypes.map((type) => ({
													id: type._id,
													name: type.name,
													ECT: type.ECT,
													category:
														categories.find(
															(cat) => cat._id === type.categoryId
														)?.name || "N/A",
											  }))
											: []
									}
									onEdit={handleEditItem}
									onSave={handleSaveItem}
									onArchive={(id) => handleArchive("furniture-types", id)}
								/>
							</div>
						</div>
					)}

					{selectedFilter === "Colors" && (
						<div className="space-y-4">
							<h2 className="text-2xl font-bold mb-4">Furniture Colors</h2>
							<div className="max-h-96 overflow-y-auto">
								<Table
									headers={["Color Name", "RGB", "Hex"]}
									data={
										Array.isArray(colors)
											? colors.map((color) => ({
													id: color._id,
													name: color.name,
													rgb: color.rgb,
													hex: color.hex,
											  }))
											: []
									}
									onEdit={handleEditItem}
									onSave={handleSaveItem}
									onArchive={(id) => handleArchive("colors", id)} // Pass entity type and ID
								/>
							</div>
						</div>
					)}

					{selectedFilter === "Furniture Materials" && (
						<div className="space-y-4 mt-8">
							<h2 className="text-2xl font-bold mb-4">Furniture Materials</h2>
							<div className="max-h-96 overflow-y-auto">
								<Table
									headers={["Material Name", "Stocks"]}
									data={
										Array.isArray(materials)
											? materials.map((material) => ({
													id: material._id,
													name: material.name,
													stocks: material.stocks,
											  }))
											: []
									}
									onEdit={handleEditItem}
									onSave={handleSaveItem}
									onArchive={(id) => handleArchive("materials", id)} // Pass entity type and ID
								/>
							</div>
						</div>
					)}
					{selectedFilter === "Furniture Size" && (
						<div className="space-y-4 mt-8">
							<h2 className="text-2xl font-bold mb-4">Furniture Sizes</h2>
							<div className="max-h-96 overflow-y-auto">
								<Table
									headers={[
										"Size Label",
										"Height",
										"Width",
										"Depth",
										"Furniture Type",
									]}
									data={
										Array.isArray(sizes)
											? sizes.map((size) => ({
													id: size._id,
													label: size.label,
													heigth: size.height,
													width: size.width,
													depth: size.depth,
													furnitureTypes:
														furnitureTypes.find(
															(type) => type._id === size.furnitureTypeId
														)?.name || "N/A",
											  }))
											: []
									}
									onEdit={handleEditItem}
									onSave={handleSaveItem}
									onArchive={(id) => handleArchive("sizes", id)}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default Maintenance;
