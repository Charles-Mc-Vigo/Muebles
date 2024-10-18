import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Home = () => {
  const [furnitureData, setFurnitureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6); // Initial number of visible items
  const [selectedCategories, setSelectedCategories] = useState(new Set()); // State to manage selected categories
  const [priceRange, setPriceRange] = useState([0, 1000]); // Default price range

  // Fetch the furniture data from API
  useEffect(() => {
    const fetchFurnitureData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/furnitures");
        if (!response.ok) {
          throw new Error("Failed to fetch furniture sets");
        }
        const data = await response.json();
        console.log("Fetched Data:", data); // Log to check the structure of data

        if (Array.isArray(data)) {
          setFurnitureData(data);
        } else if (data && Array.isArray(data.furnitures)) {
          setFurnitureData(data.furnitures);
        } else {
          throw new Error("Invalid data format received");
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchFurnitureData();
    fetchCategories(); // Call to fetch categories
  }, []);

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6); // Increase the visible count
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories((prev) => {
      const newSelection = new Set(prev);
      if (checked) {
        newSelection.add(value);
      } else {
        newSelection.delete(value);
      }
      return newSelection;
    });
  };

  const handlePriceRangeChange = (event) => {
    const value = event.target.value.split(",").map(Number);
    setPriceRange(value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white text-gray-800 flex flex-col min-h-screen">
      {/* Header */}
      <Header showLogout={true} />

      {/* Shop Hero Section */}
      <section className="relative">
        <img
          src="https://images.pexels.com/photos/245219/pexels-photo-245219.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Shop Hero"
          className="w-full h-80 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-center">
          <h1 className="text-5xl font-bold">Browse Our Collection</h1>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Section - Vertical Filter */}
        <section className="w-1/5 border p-4 mb-2 mr-2 mt-2 flex flex-col">
          <h1 className="text-2xl font-bold mb-4">ALL FURNITURES</h1>
          <h2 className="text-lg font-bold mb-2">Categories</h2>
          <ul className="space-y-2 flex-col">
            {categories.map((category) => (
              <li key={category._id} className="flex items-center">
                <input
                  type="checkbox"
                  value={category.name} // Use category name as the value
                  checked={selectedCategories.has(category.name)}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label>{category.name}</label>
              </li>
            ))}
          </ul>

          {/* Price Range Filter */}
          <h2 className="text-lg font-bold mb-2 mt-4">Price Range</h2>
          <input
            type="range"
            min="0"
            max="50000"
            step="10"
            value={priceRange.join(",")}
            onChange={handlePriceRangeChange}
            className="w-full"
          />
          <div className="flex justify-between">
            <span>₱{priceRange[0]}</span>
            <span>₱{priceRange[1]}</span>
          </div>
        </section>

        <section className="w-full">

          {/* Furniture Sets Section */}
          <section className="py-16 px-8  flex-grow m-2">
            <h2 className="text-4xl font-bold text-center mb-10">
              Furniture Sets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {furnitureData.slice(0, visibleCount).map((furniture) => (
                <ProductCard
                  key={furniture._id} // Ensure this id is unique for each furniture item
                  id={furniture._id}
                  image={furniture.image}
                  name={furniture.name}
                  price={furniture.price}
                  description={furniture.description}
                  showViewDetails={true}
                  showAddToCart={true}
                  showUpdateButton={false}
                />
              ))}
            </div>

            {visibleCount < furnitureData.length && ( // Check if there are more items to load
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="bg-green-600 text-white px-4 py-2  hover:bg-green-700"
                >
                  Load More
                </button>
              </div>
            )}
          </section>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
