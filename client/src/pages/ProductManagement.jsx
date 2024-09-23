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

	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
	const totalPages = Math.ceil(products.length / productsPerPage);

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6 text-center">Product Management</h1>
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
							<option value="door">Door</option>
							<option value="bed_frame">Bed frame</option>
							<option value="cabinet">Cabinet</option>
							<option value="chair">Chair</option>
							<option value="table">Table</option>
							<option value="sala_set">Sala set</option>
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
							<option value="modern">Modern</option>
							<option value="classic">Classic</option>
							<option value="rustic">Rustic</option>
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
				<div className="w-full md:w-2/3 rounded-lg shadow-lg flex flex-col h-full">
					<table className="w-full bg-white shadow-lg rounded-lg flex-grow">
						<thead className="bg-gray-50">
							<tr>
								<th className="p-4 text-left">Image</th>
								<th className="p-4 text-left">Category</th>
								<th className="p-4 text-left">Type</th>
								<th className="p-4 text-left">Product Name</th>
								<th className="p-4 text-left">Description</th>
								<th className="p-4 text-left">Price</th>
								<th className="p-4 text-left">Actions</th>
							</tr>
						</thead>
						<tbody>
							{currentProducts.map((product) => (
								<tr key={product._id} className="border-t">
									<td className="p-4">
										{product.image && (
											<img
												src={`data:image/jpeg;base64,${product.image}`}
												alt={product.productName}
												className="w-20 h-20 object-cover"
											/>
										)}
									</td>
									<td className="p-4">{product.category}</td>
									<td className="p-4">{product.furnitureType}</td>
									<td className="p-4">{product.productName}</td>
									<td className="p-4">{product.description}</td>
									<td className="p-4">PHP {product.price}</td>
									<td className="p-4 flex space-x-2">
										<button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
											Edit
										</button>
										<button
											onClick={() => handleDelete(product._id)}
											className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{/* Pagination Controls */}
					<div className="flex justify-between items-center mt-4">
						<button
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
							disabled={currentPage === 1}
						>
							Previous
						</button>
						<span>
							Page {currentPage} of {totalPages}
						</span>
						<button
							onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
							className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
							disabled={currentPage === totalPages}
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
