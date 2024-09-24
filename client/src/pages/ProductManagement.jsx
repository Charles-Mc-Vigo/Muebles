import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductManagement = () => {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]); 
	const [colors,setColors] = useState([]);
	const [furnitureTypes,setFurnitureTypes] = useState([]);
	const [materials,setMaterials] = useState([]);
	const [newProduct, setNewProduct] = useState({
		image: null,
		category: "",
		furnitureType: "",
		name: "",
		description: "",
		price: "",
		color:"",
		material:"",
		stocks:""
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [productsPerPage] = useState(5);

	// State for filtering
	const [filterCategory, setFilterCategory] = useState("");
	const [filterType, setFilterType] = useState("");

	// State for sorting by date
	const [sortOrder, setSortOrder] = useState("newest");

	// Fetch categories from the backend
	const fetchCategories = async () => {
		try {
			const response = await axios.get("http://localhost:3000/api/categories");
			setCategories(response.data); // Assume response data contains array of categories
		} catch (error) {
			console.error("Error fetching categories:", error);
			alert("Failed to fetch categories. Please try again.");
		}
	};

	// Fetch furniture products from the backend
	const fetchProducts = async () => {
		try {
			const response = await axios.get("http://localhost:3000/api/furnitures");
			console.log("Fetched products:", response.data);
			setProducts(response.data);
		} catch (error) {
			console.error("Error fetching products:", error);
			alert("Failed to fetch products. Please try again.");
		}
	};

		// Fetch furniture color from the backend
		const fetchColors = async () => {
			try {
				const response = await axios.get("http://localhost:3000/api/colors");
				console.log("Fetched colors:", response.data);
				setColors(response.data);
			} catch (error) {
				console.error("Error fetching colors:", error);
				alert("Failed to fetch color. Please try again.");
			}
		};
		//fetch furniturestype
		const fetchFurnitureTypes = async () => {
			try {
				const response = await axios.get("http://localhost:3000/api/furniture-types");
				console.log("Fetched furnituretypes:", response.data);
				setFurnitureTypes(response.data);
			} catch (error) {
				console.error("Error fetching furnituretypes:", error);
				alert("Failed to fetch furniture types. Please try again.");
			}
		};
		// fetch materials
		const fetchMaterials = async () => {
			try {
				const response = await axios.get("http://localhost:3000/api/materials");
				console.log("Fetched Material:", response.data);
				setMaterials(response.data);
			} catch (error) {
				console.error("Error fetching materials:", error);
				alert("Failed to fetch materials. Please try again.");
			}
		};
	
	

	useEffect(() => {
		fetchCategories(); // Fetch categories when the component loads
		fetchProducts(); // Fetch products when the component loads
		fetchColors();// Fetch color  when the component loads
		fetchFurnitureTypes(); // fetch furnituretypes
		fetchMaterials(); // fetchmaterials
	}, []);

	const handleInputChange = (e) => {
		const { name, value, files } = e.target;
		setNewProduct((prevData) => ({
			...prevData,
			[name]: files ? files[0] : value,
		}));
	};

	const handleDelete = async (id) => {
		try {
			await axios.delete(`http://localhost:3000/api/furnitures/furniture/${id}`);
			setProducts(products.filter((product) => product._id !== id));
			alert("Product deleted successfully.");
		} catch (error) {
			console.error("Error deleting product:", error);
			alert("Failed to delete the product. Please try again.");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const form = new FormData();
		form.append("image", newProduct.image);
		form.append("category", newProduct.category);
		form.append("furnitureType", newProduct.furnitureType);
		form.append("name", newProduct.name);
		form.append("description", newProduct.description);
		form.append("price", newProduct.price);
		form.append("color", newProduct.color);
		form.append("material", newProduct.material);
		form.append("stocks", newProduct.stocks);

		try {
			const response = await axios.post(
				"http://localhost:3000/api/furnitures/add",
				form,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			alert(`${response.data.furniture.name} has been added successfully!`);
			fetchProducts();
			setNewProduct({
				image: null,
				category: "",
				furnitureType: "",
				name: "",
				description: "",
				price: "",
				color:"",
				material:"",
				stocks:""
			});
			document.getElementById("image").value = "";
		} catch (error) {
			console.error("Error creating furniture!", error.response?.data || error.message);
			alert(error.response?.data?.message || error.message || "Cannot add furniture!");
		}
	};

	// Filtering logic based on category and type
	const filteredProducts = products.filter((product) => {
		return (
			(!filterCategory || product.category === filterCategory) &&
			(!filterType || product.furnitureType === filterType)
		);
	});

	// Sorting logic based on the created date
	const sortedProducts = filteredProducts.sort((a, b) =>
		sortOrder === "newest"
			? new Date(b.createdAt) - new Date(a.createdAt)
			: new Date(a.createdAt) - new Date(b.createdAt)
	);

	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
	const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-2 text-center">Product Management</h1>

			{/* Filter and Sort Section */}
			<div className="mb-2 flex gap-4 justify-end">
				<select
					name="filterCategory"
					onChange={(e) => setFilterCategory(e.target.value)}
					value={filterCategory}
					className="bg-gray-100 p-2 rounded-lg border border-gray-300"
				>
					<option value="">All Categories</option>
					{categories.map((category) => (
						<option key={category._id} value={category.name}>
							{category.name}
						</option>
					))}
				</select>

				<select
					name="filterType"
					onChange={(e) => setFilterType(e.target.value)}
					value={filterType}
					className="bg-gray-100 p-2 rounded-lg border border-gray-300"
				>
					<option value="">All Types</option>
					<option value="sala-set">Sala Set</option>
					<option value="dining-set">Dining Set</option>
					<option value="bedroom-set">Bedroom Set</option>
					<option value="contemporary">Contemporary</option>
				</select>

				{/* Sort by Date Dropdown */}
				<select
					name="sortOrder"
					onChange={(e) => setSortOrder(e.target.value)}
					value={sortOrder}
					className="bg-gray-100 p-3 rounded-lg border border-gray-300"
				>
					<option value="newest">Newest</option>
					<option value="oldest">Oldest</option>
				</select>
			</div>

			<div className="flex gap-6">
				{/* Product Form Section */}
				<div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg flex flex-col h-full">
					<form onSubmit={handleSubmit} className="space-y-6 flex-grow">
						{/* Category Dropdown */}
						<select
							name="category"
							onChange={handleInputChange}
							value={newProduct.category}
							className="bg-gray-100 p-3 rounded-lg w-full border border-gray-300"
							required
						>
							<option value="">Select Category</option>
							{categories.map((category) => (
								<option key={category._id} value={category.name}>
									{category.name}
								</option>
							))}
						</select>

						{/* Furniture Type Dropdown */}
						<select
							name="furnitureType"
							onChange={handleInputChange}
							value={newProduct.furnitureType}
							className="bg-gray-100 p-3 rounded-lg w-full border border-gray-300"
							required
						>
							<option value="">Select Furniture Type</option>
							{furnitureTypes.map((furnitureType) => (
								<option key={furnitureType._id} value={furnitureType.name}>
									{furnitureType.name}
								</option>
							))}
							
						</select>

						{/* Product Name */}
						
						<input
							type="text"
							name="name"
							placeholder="Product Name"
							value={newProduct.name}
							onChange={handleInputChange}
							className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
							required
						/>

						{/* Color */}
						<select 
							name="color"
							onChange={handleInputChange}
							value={newProduct.color}
							className="bg-gray-100 p-3 rounded-lg w-full border border-gray-300"
							required
						>
							<option value="">Select Furniture Color</option>
							{colors.map((colors) => (
								<option key={colors._id} value={colors.name}>
									{colors.name}
								</option>
							))}
						</select>

						{/* Materials */}
						<select 
							name="material"
							onChange={handleInputChange}
							value={newProduct.material}
							className="bg-gray-100 p-3 rounded-lg w-full border border-gray-300"
							required
						>
							<option value="">Select Materials</option>
							{materials.map((materials) => (
								<option key={materials._id} value={materials.name}>
									{materials.name}
								</option>
							))}
						</select>

						{/* stock */}
						<input
							type="number"
							name="stocks"
							placeholder="Stock"
							value={newProduct.stocks}
							onChange={handleInputChange}
							className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
							required
						/>

						{/* Description */}
						<textarea
							name="description"
							placeholder="Description"
							value={newProduct.description}
							onChange={handleInputChange}
							className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
							rows="4"
						/>

						{/* Price */}
						<input
							type="number"
							name="price"
							placeholder="Price"
							value={newProduct.price}
							onChange={handleInputChange}
							className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
							required
						/>

						{/* Image Upload */}
						<div className="flex items-center space-x-4">
								<label className=" text-black p-1 text-lg rounded-lg cursor-pointer border-2 hover:bg-O">
									<input
										type="file"
										name="image"
										id="image"
										onChange={handleInputChange}
										className="hidden"
										required
									/>
									Choose Image
								</label>
								{/* Display selected file name or a message */}
								{newProduct.image ? (
									<div className="flex items-center space-x-2">
										<span>{newProduct.image.name}</span>
										<button
											type="button"
											className="text-red-500 hover:underline"
											onClick={() => setNewProduct({ ...newProduct, image: null })} 
										>
											Remove
										</button>
									</div>
								) : (
									<span>No file chosen</span>
								)}
						</div>


						{/* Submit Button */}
						<button
							type="submit"
							className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
						>
							Add Product
						</button>
					</form>
				</div>

				{/* Product List Section */}
				<div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-lg">
					

					{/* Pagination */}
					<div className="mt-4 flex justify-between">
						<button
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}
							className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
						>
							Previous
						</button>
						<span>
							Page {currentPage} of {totalPages}
						</span>
						<button
							onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
							disabled={currentPage === totalPages}
							className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductManagement;
