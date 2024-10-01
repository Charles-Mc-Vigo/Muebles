import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [furnitureTypes, setFurnitureTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({
    livingRoom: false,
    bedroom: false,
    diningRoom: false,
  });
  const [selectedFurnitureTypes, setSelectedFurnitureTypes] = useState({});

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

  // Fetch furniture types from the backend
  const fetchFurnitureTypes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/furniture-types");
      console.log("Fetched furniture types:", response.data);
      setFurnitureTypes(response.data);
    } catch (error) {
      console.error("Error fetching furniture types:", error);
      alert("Failed to fetch furniture types. Please try again.");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchFurnitureTypes();
  }, []);

  // Handle checkbox change for categories
  const handleCategoryCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedCategories((prevCategories) => ({
      ...prevCategories,
      [name]: checked,
    }));
  };

  // Handle checkbox change for furniture types
  const handleFurnitureTypeCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedFurnitureTypes((prevTypes) => ({
      ...prevTypes,
      [name]: checked,
    }));
  };

  // Filtering products on selected categories and furniture types
  const filteredProducts = products.filter((product) => {
    const isLivingRoom = selectedCategories.livingRoom && product.category?.name === "Living Room";
    const isBedroom = selectedCategories.bedroom && product.category?.name === "Bed Room";
    const isDiningRoom = selectedCategories.diningRoom && product.category?.name === "Dining Room";

    const isFurnitureTypeSelected = selectedFurnitureTypes[product.furnitureType?.name] || !Object.values(selectedFurnitureTypes).some(Boolean);

    return (isLivingRoom || isBedroom || isDiningRoom || (!selectedCategories.livingRoom && !selectedCategories.bedroom && !selectedCategories.diningRoom)) && isFurnitureTypeSelected;
  });

  const handleCardClick = (product) => {
    // Logic to show product information, e.g., modal or navigate to product detail page
    console.log("Product clicked:", product);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full">
        <Header />
      </header>
      <div className="flex-grow flex">
        <aside className="w-60 bg-white border-2 border-oliveGreen p-5 text-black mt-2 ml-2 mb-2 overflow-y-auto h-full">
          <h2 className="text-xl font-bold mb-2">JCKAME Furnitures</h2>

          {/* Categories Filter */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                name="livingRoom"
                checked={selectedCategories.livingRoom}
                onChange={handleCategoryCheckboxChange}
                className="mr-2"
              />
              Living Room
            </label>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                name="bedroom"
                checked={selectedCategories.bedroom}
                onChange={handleCategoryCheckboxChange}
                className="mr-2"
              />
              Bed Room
            </label>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                name="diningRoom"
                checked={selectedCategories.diningRoom}
                onChange={handleCategoryCheckboxChange}
                className="mr-2"
              />
              Dining Room
            </label>
          </div>

          {/* Furniture Types Filter */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Furniture Types</h3>
            {furnitureTypes.map((type) => (
              <label key={type._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  name={type.name}
                  checked={selectedFurnitureTypes[type.name] || false}
                  onChange={handleFurnitureTypeCheckboxChange}
                  className="mr-2"
                />
                {type.name}
              </label>
            ))}
          </div>

          {/* Additional Options */}
          <h3 className="text-lg font-semibold">Other Options</h3>
          <ul>
            <li className="mb-2">Option 1</li>
            <li className="mb-2">Option 2</li>
            <li className="mb-2">Option 3</li>
          </ul>
        </aside>

        {/* Main content section */}
        <main className="flex-grow container ml-2 p-2">
          <div className="h-full overflow-y-auto p-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 border-2 p-5 border-oliveGreen">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white shadow-lg rounded-lg overflow-clip border border-gray-200 cursor-pointer"
                    style={{ width: '260px', height: '420px', margin: '1px' }}
                    onClick={() => handleCardClick(product)} // Make the card clickable
                  >
                    <div
                      className="bg-gray-100 flex items-center justify-center"
                      style={{ width: '100%', height: '180px' }}
                    >
                      {product.image ? (
                        <img
                          src={`data:image/png;base64,${product.image}`}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </div>
                    <div className="p-2">
                      <h2 className="text-lg font-semibold text-gray-800 mb-1">
                        {product.name}
                      </h2>
                      <p className="text-gray-600 mb-1">
                        Category:{" "}
                        <span className="text-gray-800 font-medium">
                          {product.category?.name}
                        </span>
                      </p>
                      <p className="text-gray-600 mb-1">
                        Type:{" "}
                        <span className="text-gray-800 font-medium">
                          {product.furnitureType?.name}
                        </span>
                      </p>
                      <p className="text-gray-600 mb-1">
                        Price:{" "}
                        <span className="text-green-600 font-bold">
                          ₱{product.price}
                        </span>
                      </p>
                      <p className="text-gray-600 mb-1">
                        Stock:{" "}
                        <span className="text-green-600 font-bold">
                          {product.stocks}
                        </span>
                      </p>
                    </div>
                    
                    {/* View Product Button */}
                    <div className="p-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the card click
                          handleCardClick(product); // Handle button click
                        }}
                      >
                        View Product
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-full">
                  No products found.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
      <footer className="w-full mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
