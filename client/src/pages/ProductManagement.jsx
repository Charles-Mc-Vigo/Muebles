import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductManagement = () => {
	const [products, setProducts] = useState([]);
	const [newProduct, setNewProduct] = useState({
		image: null,
		category: "",
		furnitureType: "",
		productName: "",
		description: "",
		price: "",
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [productsPerPage] = useState(5);

	// State for filtering
	const [filterCategory, setFilterCategory] = useState("");
	const [filterType, setFilterType] = useState("");

	// State for sorting by date
	const [sortOrder, setSortOrder] = useState("newest");

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

	useEffect(() => {
		fetchProducts();
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
		form.append("productName", newProduct.productName);
		form.append("description", newProduct.description);
		form.append("price", newProduct.price);

		try {
			const response = await axios.post(
				"http://localhost:3000/api/furnitures/add-furniture",
				form,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			alert(`${response.data.furniture.productName} has been added successfully!`);
			fetchProducts();
			setNewProduct({
				image: null,
				category: "",
				furnitureType: "",
				productName: "",
				description: "",
				price: "",
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
					<option value="livingroom">LivingRoom</option>
					<option value="bedroom">Bedroom</option>
					<option value="diningroom">DiningRoom</option>
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
							<option value="livingroom">LivingRoom</option>
							<option value="bedroom">Bedroom</option>
							<option value="diningroom">DiningRoom</option>
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
							<option value="sala-set">Sala Set</option>
							<option value="dining-set">Dining Set</option>
							<option value="bedroom-set">Bedroom Set</option>
							<option value="contemporary">Contemporary</option>
						</select>

						{/* Product Name */}
						<input
							type="text"
							name="productName"
							placeholder="Product Name"
							value={newProduct.productName}
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
							<label className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600">
								<input
									type="file"
									name="image"
									id="image"
									onChange={handleInputChange}
									className="hidden"
								/>
								Choose File
							</label>
							<span>{newProduct.image ? newProduct.image.name : "No file chosen"}</span>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-bold"
						>
							Add Product
						</button>
					</form>
				</div>

				{/* Product Table Section */}
				<div className="w-full md:w-2/3">
					<h2 className="text-2xl font-bold mb-2">Products</h2>

					<table className="table-auto w-full">
						<thead>
							<tr>
								<th className="px-4 py-2">Image</th>
								<th className="px-4 py-2">Category</th>
								<th className="px-4 py-2">Type</th>
								<th className="px-4 py-2">Name</th>
								<th className="px-4 py-2">Description</th>
								<th className="px-4 py-2">Price</th>
								<th className="px-4 py-2">Actions</th>
							</tr>
						</thead>
						<tbody>
							{currentProducts.map((product) => (
								<tr key={product._id}>
									<td className="border px-4 py-2">
										<img
											src={`http://localhost:3000/${product.imageUrl}`}
											alt={product.productName}
											className="w-16 h-16 object-cover"
										/>
									</td>
									<td className="border px-4 py-2">{product.category}</td>
									<td className="border px-4 py-2">{product.furnitureType}</td>
									<td className="border px-4 py-2">{product.productName}</td>
									<td className="border px-4 py-2">{product.description}</td>
									<td className="border px-4 py-2">{product.price}</td>
									<td className="border px-4 py-2">
										<button
											className="bg-red-500 text-white px-4 py-2 rounded-lg"
											onClick={() => handleDelete(product._id)}
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{/* Pagination */}
					<div className="flex justify-center mt-4">
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<button
								key={page}
								onClick={() => setCurrentPage(page)}
								className={`px-3 py-1 mx-1 rounded-lg ${
									currentPage === page
										? "bg-blue-500 text-white"
										: "bg-gray-300 text-black"
								}`}
							>
								{page}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductManagement;
