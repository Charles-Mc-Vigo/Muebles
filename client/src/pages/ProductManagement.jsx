import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductManagement = () => {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]); // State to hold fetched categories
	const [newProduct, setNewProduct] = useState({
		image: null,
		category: "",
		furnitureType: "",
		description: "",
		price: "",
	});

	// Fetch categories from the backend
	const fetchCategories = async () => {
		try {
			const response = await axios.get("http://localhost:3000/api/category");
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
			setProducts(response.data);
		} catch (error) {
			console.error("Error fetching products:", error);
			alert("Failed to fetch products. Please try again.");
		}
	};

	useEffect(() => {
		fetchCategories(); // Fetch categories when the component loads
		fetchProducts(); // Fetch products when the component loads
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
			alert(`${response.data.furniture.furnitureType} has been added successfully!`);
			fetchProducts(); // Refetch products after adding a new one
			setNewProduct({
				image: null,
				category: "",
				furnitureType: "",
				description: "",
				price: "",
			});
			document.getElementById("image").value = "";
		} catch (error) {
			console.error(
				"Error creating furniture!",
				error.response?.data || error.message
			);
			alert(
				error.response?.data?.message || error.message || "Cannot add furniture!"
			);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Product Management</h1>
			<div className="flex flex-col md:flex-row gap-4">
				{/* Product Form */}
				<div className="w-full md:w-1/3 bg-white p-4 rounded shadow">
					<form onSubmit={handleSubmit} className="space-y-4">
						<input
							type="file"
							name="image"
							id="image"
							onChange={handleInputChange}
						/>
						<select
							id="category"
							name="category"
							required
							onChange={handleInputChange}
							value={newProduct.category}
							className="bg-slate-100 p-3 rounded-lg w-full"
						>
							<option value="">Select a category</option>
							{categories.map((category) => (
								<option key={category._id} value={category.name}>
									{category.name}
								</option>
							))}
						</select>
						<input
							type="text"
							name="furnitureType"
							placeholder="Type"
							value={newProduct.furnitureType}
							onChange={handleInputChange}
							className="w-full p-2 border rounded"
						/>
						<textarea
							name="description"
							placeholder="Description"
							value={newProduct.description}
							onChange={handleInputChange}
							className="w-full p-2 border rounded"
							rows="3"
						/>
						<input
							type="number"
							name="price"
							placeholder="Price"
							value={newProduct.price}
							onChange={handleInputChange}
							className="w-full p-2 border rounded"
						/>
						<button
							type="submit"
							className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
						>
							Submit
						</button>
					</form>
				</div>

				{/* Product Table */}
				<div className="w-full md:w-2/3">
					<div className="overflow-x-auto">
						<table className="w-full bg-white shadow rounded">
							<thead className="bg-gray-50">
								<tr>
									<th className="p-2 text-left">Image</th>
									<th className="p-2 text-left">Category</th>
									<th className="p-2 text-left">Type</th>
									<th className="p-2 text-left">Description</th>
									<th className="p-2 text-left">Price</th>
									<th className="p-2 text-left">Action</th>
								</tr>
							</thead>
							<tbody>
								{products.length === 0 ? (
									<tr>
										<td colSpan="6" className="text-center">
											No furnitures found. Create one.
										</td>
									</tr>
								) : (
									products.map((product) => (
										<tr key={product._id} className="border-t">
											<td className="p-2">
												{product.image && (
													<img
														src={`data:image/jpeg;base64,${product.image}`}
														alt={product.furnitureType}
														className="w-20 h-20 object-cover"
													/>
												)}
											</td>
											<td className="p-2">{product.category}</td>
											<td className="p-2">{product.furnitureType}</td>
											<td className="p-2">{product.description}</td>
											<td className="p-2">
												<strong>PHP</strong>
												<span className="px-2"></span> {product.price}
											</td>
											<td className="p-2">
												<button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600">
													Edit
												</button>
												<button
													onClick={() => handleDelete(product._id)}
													className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
												>
													Delete
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductManagement;
