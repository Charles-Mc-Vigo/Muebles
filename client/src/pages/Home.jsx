import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { FaFilter, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [furnitureData, setFurnitureData] = useState([]);
  const [FurnitureTypes,setFurnitureTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Fetch furniture data
  useEffect(() => {
    const fetchFurnitureData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/furnitures", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch furniture sets");
        const data = await response.json();

        if (Array.isArray(data)) {
          setFurnitureData(data);
        } else if (data?.furnitures) {
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
    const fetchFurnitureTypes = async() =>{
      try{
        const response = await fetch("http://localhost:3000/api/furniture-types");
        const data = await response.json();
        setFurnitureTypes(data);
      } catch (error){
        console.error("Failed to fetch FurnitureTyeps:", error)
      }
    };

 
    fetchFurnitureData();
    fetchCategories();
    fetchFurnitureTypes();
  }, []);

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cart", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch cart count");

      const data = await response.json();
      setCartCount(data.cart.count || 0); // Update cart count based on API response
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const handCartRefresh = async () => {
    await fetchCartCount();
  };

  useEffect(() => {
    fetchCartCount(); // Fetch cart count when the component mounts
  }, []);

  useEffect(() => {
    // Handle body scroll when filter is open on mobile
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFilterOpen]);

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };
  const showToast = (message, type) => {
    toast[type](message);
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

  const incrementCartCount = () => {
    setCartCount((prevCount) => prevCount + 1);
  };

  const handlePriceRangeChange = (event) => {
    const value = event.target.value.split(",").map(Number);
    setPriceRange(value);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Filters</h1>

      <div>
        <h2 className="text-lg font-semibold mb-3">Categories</h2>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category._id} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category._id}`}
                value={category.name}
                checked={selectedCategories.has(category.name)}
                onChange={handleCheckboxChange}
                className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label
                htmlFor={`category-${category._id}`}
                className="ml-2 text-sm"
              >
                {category.name}
              </label>
            </li>
          ))}
        </ul>
        
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Price Range</h2>
        <input
          type="range"
          min="0"
          max="50000"
          step="10"
          value={priceRange.join(",")}
          onChange={handlePriceRangeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between mt-2 text-sm">
          <span>₱{priceRange[0].toLocaleString()}</span>
          <span>₱{priceRange[1].toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white text-gray-800 flex flex-col min-h-screen">
      <Header isLogin={true} cartCount={cartCount} />
      <ToastContainer
        style={{ top: "80px", right: "50px" }}
        autoClose={3000}
        hideProgressBar
      />

      {/* Hero Section */}
      <section className="relative w-full h-48 sm:h-64 md:h-80">
        <img
          src="https://images.pexels.com/photos/245219/pexels-photo-245219.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Shop Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center px-4">
            Browse Our Collection
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 max-w-7xl mx-auto w-full px-4 py-6 gap-6">
        {/* Filter Button (Mobile) */}
        <button
          onClick={toggleFilter}
          className="md:hidden fixed bottom-4 right-4 z-30 bg-teal-600 text-white p-4 rounded-full shadow-lg"
          aria-label="Toggle filters"
        >
          <FaFilter className="text-xl" />
        </button>

        {/* Filter Sidebar */}
        <aside
          className={`
          fixed md:static inset-0 z-40 
          ${isFilterOpen ? "block" : "hidden"} 
          md:block w-full md:w-64 lg:w-72
        `}
        >
          {/* Mobile Filter Overlay */}
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleFilter}
          />

          {/* Filter Content */}
          <div
            className={`
            fixed md:static right-0 top-0 h-full w-72
            bg-white p-6 overflow-y-auto
            transform transition-transform duration-300
            ${isFilterOpen ? "translate-x-0" : "translate-x-full"}
            md:transform-none
          `}
          >
            {/* Close Button (Mobile) */}
            <button
              onClick={toggleFilter}
              className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-xl" />
            </button>

            <FilterContent />
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Furniture Sets
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {furnitureData.slice(0, visibleCount).map((furniture) => (
              <ProductCard
                key={furniture._id}
                id={furniture._id}
                images={furniture.images}
                name={furniture.name}
                price={furniture.price}
                description={furniture.description}
                showViewDetails={true}
                showAddToCart={true}
                showUpdateButton={false}
                showToast={showToast}
                onAddToCart={() => {
                  incrementCartCount(); // Increment local cart count
                  fetchCartCount(); // Refresh cart count from API
                }}
                onRefresh={handCartRefresh}
              />
            ))}
          </div>

          {visibleCount < furnitureData.length && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
