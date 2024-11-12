import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";
import { FaFilter, FaTimes } from "react-icons/fa";
import Select from "react-select";
import Slider from "react-slider";
import "react-toastify/dist/ReactToastify.css";


const Home = () => {
  // State variables
  const [furnitureData, setFurnitureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [furnitureTypes, setFurnitureTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFurnitureTypes, setSelectedFurnitureTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 120000]);
  const itemsPerPage = 8;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchFurnitureData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/furnitures", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setFurnitureData(Array.isArray(data) ? data : data?.furnitures || []);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch furniture sets");
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
    const fetchFurnitureTypes = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/furniture-types"
        );
        const data = await response.json();
        console.log("Fetched furniture types:", data); // Add this line
        setFurnitureTypes(data);
      } catch (error) {
        console.error("Failed to fetch furniture types:", error);
      }
    };

    fetchFurnitureTypes();
    fetchCategories();
    fetchFurnitureData();
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cart", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch cart count");
      const data = await response.json();
      setCartCount(data.cart.count || 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  const showToast = (message, type) => toast[type](message);
  const incrementCartCount = () => setCartCount((prevCount) => prevCount + 1);

  // Filtered furniture data
  const filteredFurnitureData = furnitureData.filter((item) => {
    console.log("Furniture data:", furnitureData);

    console.log("Item furniture types:", item.furnitureTypes);
    console.log("Selected furniture types:", selectedFurnitureTypes);

    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.some((category) =>
        item.category.name.includes(category.value)
      );

    const typeMatch =
      selectedFurnitureTypes.length === 0 ||
      (Array.isArray(selectedFurnitureTypes) &&
        selectedFurnitureTypes.some(
          (type) =>
            item.furnitureType?.name?.toLowerCase() === type.value.toLowerCase()
        ));

    const priceMatch =
      item.price >= priceRange[0] && item.price <= priceRange[1];

    return categoryMatch && typeMatch && priceMatch;
  });
  console.log("Furniture data:", furnitureData);

  // Pagination logic
  const totalPages = Math.ceil(filteredFurnitureData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFurnitureData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Filter handlers
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategories(selectedOption || []);
  };

  const handleFurnitureTypeChange = (selectedOption) => {
    setSelectedFurnitureTypes(selectedOption || []);
    console.log("Selected furniture types:", selectedOption);
  };
  const handlePriceChange = (value) => {
    setPriceRange(value);
  };
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#38b2ac" : "white", // teal on hover
      color: state.isFocused ? "white" : "black",
    }),
    control: (provided) => ({
      ...provided,
      "&:hover": { borderColor: "#38b2ac" }, // Control hover border color
    }),
  };

  // Toggle mobile filter
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen); // Toggle sidebar visibility
  };
  useEffect(() => {
    // Handle body scroll when filter is open on mobile
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset"; // Reset scroll when the component is unmounted or when filter closes
    };
  }, [isFilterOpen]);

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
      <div className="flex flex-col max-w-7xl mx-auto w-full px-4 py-8 mb-2">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4 bg-white  p-4 ">
            <div className="flex items-center gap-2 mb-6 mt-2">
              <FaFilter className="text-3xl text-teal-600" />
              <h1 className="text-2xl font-semibold">Filter</h1>
            </div>

            <div className="flex flex-col flex-wrap justify-between w-full">
              {/* Filter Categories */}
              <div className="w-full lg:w-5/6 xl:w-3/4 mb-5">
                <h2 className="text-xl font-semibold mb-2">Categories</h2>
                <Select
                  isMulti
                  options={categories.map((category) => ({
                    value: category.name,
                    label: category.name,
                  }))}
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  placeholder="Select Categories"
                  styles={customStyles}
                />
              </div>

              {/* Filter Furniture Types */}
              <div className="w-full lg:w-5/6 xl:w-3/4 mb-5">
                <h2 className="text-xl font-semibold mb-2">Furniture Types</h2>
                <Select
                  isMulti
                  options={furnitureTypes.map((type) => ({
                    value: type.name,
                    label: type.name,
                  }))}
                  value={selectedFurnitureTypes}
                  onChange={handleFurnitureTypeChange}
                  placeholder="Select Furniture Types"
                  styles={customStyles}
                />
              </div>
              <div className="w-full lg:w-5/6 xl:w-3/4">
                <h1 className="text-xl font-semibold mb-1">Price Range</h1>
                <Slider
                  min={0}
                  max={120000}
                  step={100}
                  value={priceRange}
                  onChange={handlePriceChange}
                  range
                  renderTrack={(props, state) => (
                    <div {...props} className="bg-gray-500" />
                  )}
                  renderThumb={(props, state) => (
                    <div
                      {...props}
                      className="bg-teal-600 w-4 h-4 rounded-full border-2"
                    />
                  )}
                />
                <div className="flex justify-between gap-5 mt-5 items-baseline border-t-2">
                  <span>₱{priceRange[0]}</span>
                  <span>₱{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Products Grid */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Furniture Sets
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
              {currentItems.length > 0 ? (
                currentItems.map((furniture) => (
                  <ProductCard
                    key={furniture._id}
                    id={furniture._id}
                    images={furniture.images}
                    name={furniture.name}
                    price={furniture.price}
                    description={furniture.description}
                    showViewDetails={true}
                    showPreOrder={true}
                    showUpdateButton={false}
                    showToast={showToast}
                    onAddToCart={() => {
                      incrementCartCount();
                      fetchCartCount();
                    }}
                  />
                ))
              ) : (
                <p className="text-center col-span-full text-gray-500">
                  No furniture sets available at the moment.
                </p>
              )}
            </div>

            {/* Pagination */}
            {filteredFurnitureData.length > itemsPerPage && (
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handlePreviousPage}
                  className="bg-teal-500 text-white py-2 px-4 rounded-xl hover:bg-teal-700"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  className="bg-teal-500 text-white py-2 px-4 rounded-xl hover:bg-teal-700"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
