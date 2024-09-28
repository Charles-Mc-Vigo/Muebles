import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductManagement = () => {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [colors, setColors] = useState([]);
	const [furnitureTypes, setFurnitureTypes] = useState([]);
	const [materials, setMaterials] = useState([]);
	const [newProduct, setNewProduct] = useState({
		image: null,
		category: "",
		furnitureType: "",
		name: "",
		description: "",
		price: "",
		color: "",
		material: "",
		stocks: "",
		sizes: [{ width: "", height: "", depth: "" }],
	});
	// Page navigation
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
			setCategories(response.data);
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

	// Fetch furniture colors from the backend
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

	// Fetch furniture types
	const fetchFurnitureTypes = async () => {
		try {
			const response = await axios.get(
				"http://localhost:3000/api/furniture-types"
			);
			console.log("Fetched furniture types:", response.data);
			setFurnitureTypes(response.data);
		} catch (error) {
			console.error("Error fetching furniture types:", error);
			alert("Failed to fetch furniture types. Please try again.");
		}
	};

	// Fetch materials
	const fetchMaterials = async () => {
		try {
			const response = await axios.get("http://localhost:3000/api/materials");
			console.log("Fetched materials:", response.data);
			setMaterials(response.data);
		} catch (error) {
			console.error("Error fetching materials:", error);
			alert("Failed to fetch materials. Please try again.");
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				await Promise.all([
					fetchCategories(),
					fetchProducts(),
					fetchColors(),
					fetchFurnitureTypes(),
					fetchMaterials(),
				]);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name.startsWith("sizes.")) {
      const [, dimension] = name.split(".");
      setNewProduct((prevData) => ({
        ...prevData,
        sizes: [{ ...prevData.sizes[0], [dimension]: value }]
      }));
    } else {
      setNewProduct((prevData) => ({
        ...prevData,
        [name]: files ? files[0] : value,
      }));
    }
  };

	const handleDelete = async (id) => {
		try {
			await axios.delete(
				`http://localhost:3000/api/furnitures/furniture/${id}`
			);
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
    form.append("sizes", JSON.stringify(newProduct.sizes));

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
        color: "",
        material: "",
        stocks: "",
        sizes: [{ width: "", height: "", depth: "" }]
      });
    } catch (error) {
      console.error(
        "Error creating furniture!",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          error.message ||
          "Cannot add furniture!"
      );
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
	const sortedProducts = filteredProducts.sort((a, b) => {
		const dateA = new Date(a.createdAt || 0);
		const dateB = new Date(b.createdAt || 0);
		return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
	});

	// Pagination logic
	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = sortedProducts.slice(
		indexOfFirstProduct,
		indexOfLastProduct
	);
	const totalPages = Math.max(
		Math.ceil(sortedProducts.length / productsPerPage),
		1
	);

	return (
		<div className="container mx-auto p-2">
			<h1 className="text-3xl font-bold mb-2 text-center">
				Product Management
			</h1>

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
					{furnitureTypes.map((type) => (
						<option key={type._id} value={type.name}>
							{type.name}
						</option>
					))}
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

						<input
							type="text"
							name="name"
							placeholder="Product Name"
							value={newProduct.name}
							onChange={handleInputChange}
							className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
							required
						/>

						<textarea
							name="description"
							placeholder="Description"
							value={newProduct.description}
							onChange={handleInputChange}
							className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
							required
						/>

						<input
							type="number"
							name="price"
							placeholder="Price"
							value={newProduct.price}
							onChange={handleInputChange}
							className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
							required
						/>

						{/* Color, Material, and Stock Dropdowns */}
						<select
							name="color"
							onChange={handleInputChange}
							value={newProduct.color}
							className="bg-gray-100 p-3 rounded-lg w-full border border-gray-300"
							required
						>
							<option value="">Select Color</option>
							{colors.map((color) => (
								<option key={color._id} value={color.name}>
									{color.name}
								</option>
							))}
						</select>

						<select
							name="material"
							onChange={handleInputChange}
							value={newProduct.material}
							className="bg-gray-100 p-3 rounded-lg w-full border border-gray-300"
							required
						>
							<option value="">Select Material</option>
							{materials.map((material) => (
								<option key={material._id} value={material.name}>
									{material.name}
								</option>
							))}
						</select>

						<input
							type="number"
							name="stocks"
							placeholder="Available Stocks"
							value={newProduct.stocks}
							onChange={handleInputChange}
							className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
							required
						/>
            <div className="space-y-2">
              <input
                type="number"
                name="sizes.width"
                placeholder="Width"
                value={newProduct.sizes[0].width}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
                required
              />
              <input
                type="number"
                name="sizes.height"
                placeholder="Height"
                value={newProduct.sizes[0].height}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
                required
              />
              <input
                type="number"
                name="sizes.depth"
                placeholder="Depth"
                value={newProduct.sizes[0].depth}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
                required
              />
            </div>
						<input
							type="file"
							name="image"
							id="image"
							accept="image/*"
							onChange={handleInputChange}
							className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
							required
						/>

						<button
							type="submit"
							className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full"
						>
							Add Product
						</button>
					</form>
				</div>

				<div className="w-full md:w-2/3 h-1/2 overflow-y-auto">
					{currentProducts.length > 0 ? (
						<table className="min-w-full bg-white border border-black">
							<thead>
								<tr>
									<th className="px-2 py-2 border-b border-r border-black">
										Image
									</th>
									<th className="px-2 py-2 border-b border-r border-black">
										Product Name
									</th>
									<th className="px-2 py-2 border-b border-r border-black">
										Category
									</th>
									<th className="px-2 py-2 border-b border-r border-black">
										Furniture Type
									</th>
									<th className="px-2 py-2 border-b border-r border-black">
										Description
									</th>
									<th className="px-2 py-2 border-b border-r border-black">
										Price
									</th>
									<th className="px-2 py-2 border-b border-r border-black">
										Color
									</th>
									<th className="px-2 py-2 border-b border-r border-black">
										Material
									</th>
									<th className="px-2 py-2 border-b border-r border-black">
										Stocks
									</th>
									<th className="px-2 py-2 border-b border-r border-black">
										Size (W x H x D)
									</th>
									<th className="px-2 py-2 border-b border-r border-black">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{currentProducts.map((product) => (
									<tr key={product._id} className="border-b">
										<td className="px-2 py-2">
											{product.image ? (
												<img
													src={`data:image/png;base64,${product.image}`}
													alt={product.name}
													className="w-16 h-16 object-cover rounded-lg"
												/>
											) : (
												<span>No Image</span>
											)}
										</td>
										<td className="px-2 py-2 text-center">{product.name}</td>
										<td className="px-2 py-2 text-center">
											{product.category?.name}
										</td>
										<td className="px-2 py-2 text-center">
											{product.furnitureType?.name}
										</td>
										<td className="px-2 py-2 text-center">
											{product.description}
										</td>
										<td className="px-2 py-2 text-center">₱{product.price}</td>
										<td className="px-2 py-2 text-center">
											{product.color?.name}
										</td>
										<td className="px-2 py-2 text-center">
											{product.material?.name}
										</td>
										<td className="px-2 py-2 text-center">{product.stocks}</td>
										<td className="px-2 py-2 text-center">
											{product.sizes && product.sizes[0]
												? `${product.sizes[0].width} x ${product.sizes[0].height} x ${product.sizes[0].depth}`
												: "N/A"}
										</td>
										<td className="px-2 py-2 text-center">
											<button
												onClick={() => handleDelete(product._id)}
												className="text-red-500 hover:underline"
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p className="text-center text-gray-600">No products found.</p>
					)}

					{/* Pagination Controls */}
					<div className="flex justify-center mt-4">
						<button
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}
							className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg mr-2"
						>
							Previous
						</button>
						<span className="px-4 py-2">
							{currentPage} of {totalPages}
						</span>
						<button
							onClick={() =>
								setCurrentPage((prev) => Math.min(prev + 1, totalPages))
							}
							disabled={currentPage === totalPages}
							className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg ml-2"
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
