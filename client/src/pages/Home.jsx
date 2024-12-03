import React, { useEffect, useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";
import { FaFilter, FaTimes } from "react-icons/fa";
import Select from "react-select";
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
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
    const fetchFurnitureData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/furnitures", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setFurnitureData(Array.isArray(data) ? data : data?.furnitures || []);
      } catch (error) {
        setError("Failed to fetch furniture sets");
      } finally {
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
        const response = await fetch("http://localhost:3000/api/furniture-types");
        const data = await response.json();
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
  const handleSearch = async (query) => {
    try {
      setSearchQuery(query); 
      const response = await fetch(`http://localhost:3000/api/search?query=${query}`);
      const data = await response.json();
      console.log("Search Results:", data); // Debugging
      if (data && data.length > 0) {
        setSearchResults(data);
      } else {
        setSearchResults([]); 
      }
    } catch (error) {
      console.error("Error while searching:", error);
      setSearchResults([]); 
    }console.log("Search Results:", data);
    
  };
  
  useEffect(() => {
    fetchCartCount();
  }, []);

  const showToast = (message, type) => toast[type](message);
  const incrementCartCount = () => setCartCount((prevCount) => prevCount + 1);

  const filteredFurnitureData = useMemo(() => {
    const dataToFilter = searchResults.length > 0 ? searchResults : furnitureData;
  
    if (
      selectedCategories.length === 0 &&
      selectedFurnitureTypes.length === 0 &&
      priceRange[0] === 0 &&
      priceRange[1] === 120000
    ) {
      return dataToFilter;
    }
  
    return dataToFilter.filter((item) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.some((category) =>
          item.category?.name?.includes(category.value)
        );
      const typeMatch =
        selectedFurnitureTypes.length === 0 ||
        selectedFurnitureTypes.some(
          (type) =>
            item.furnitureType?.name?.toLowerCase() === type.value.toLowerCase()
        );
      const priceMatch =
        item.price >= priceRange[0] && item.price <= priceRange[1];
  
      return categoryMatch && typeMatch && priceMatch;
    });
  }, [furnitureData, searchResults, selectedCategories, selectedFurnitureTypes, priceRange]);
  


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
  };

  const handlePriceRangeChange = (event) => {
    const value = event.target.value;
    const [minPrice, maxPrice] = value.split("-").map(Number);
    setPriceRange([minPrice, maxPrice]);
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#38b2ac" : "white",
      color: state.isFocused ? "white" : "black",
    }),
    control: (provided) => ({
      ...provided,
      width: "70%",
      minWidth: "200px",
      maxWidth: "100px",
      "&:hover": { borderColor: "#38b2ac" },
    }),
  };

  // Toggle mobile filter
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
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
    showToast(error, "error"); // Show toast notification on error
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  const FilterContent = () => (
    <div className="flex flex-col flex-wrap justify-between w-full">
      {/* Filter Categories */}
      <div className="w-full lg:w-3/4 xl:w-2/3 mb-5 p-2">
        <h2 className="text-xl text-justify font-semibold mb-2">Categories</h2>
        <Select
          isMulti
          options={categories.map((category) => ({
            value: category?.name,
            label: category?.name,
          }))}
          value={selectedCategories}
          onChange={handleCategoryChange}
          placeholder="Select Categories"
          styles={customStyles}
        />
      </div>
      {/* Filter Furniture Types */}
      <div className="w-full lg:w-5/6 xl:w-3/4 mb-5 p-2">
        <h2 className="text-xl font-semibold mb-2 whitespace-nowrap ">
          Furniture Types
        </h2>
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
      {/* Price Range Dropdown */}
      <div className="w-full lg:w-5/6 xl:w-3/4">
        <h1 className="text-xl font-semibold mb-1">Price Range</h1>
        <select
          value={`${priceRange[0]}-${priceRange[1]}`} // Set the value to the current price range
          onChange={handlePriceRangeChange}
          className="border border-gray-300 rounded p-2"
        >
          <option value="0-10000">₱0 - ₱10,000</option>
          <option value="10001-20000">₱10,001 - ₱20,000</option>
          <option value="20001-30000">₱20,001 - ₱30,000</option>
          <option value="30001-40000">₱30,001 - ₱40,000</option>
          <option value="40001-50000">₱40,001 - ₱50,000</option>
          <option value="50001-60000">₱50,001 - ₱60,000</option>
          <option value="60001-70000">₱60,001 - ₱70,000</option>
          <option value="70001-80000">₱70,001 - ₱80,000</option>
          <option value="80001-90000">₱80,001 - ₱90,000</option>
          <option value="90001-100000">₱90,001 - ₱100,000</option>
          <option value="100001-120000">₱100,001 - ₱120,000</option>
          <option value="120001-150000">₱120,001 - ₱150,000</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="bg-white text-gray-800 flex flex-col min-h-screen">
      <Header isLogin={true} cartCount={cartCount} onSearch={handleSearch}  />
      {/* <SearchResults results={searchResults} /> */}
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
        {/* Filter Button (Mobile) */}
        <button
          onClick={toggleFilter}
          className="md:hidden fixed bottom-4 right-4 z-30 bg-teal-600 text-white p-4 rounded-full shadow-lg"
          aria-label="Toggle filters"
        >
          <FaFilter className="text-xl" />
        </button>
        <div className="flex flex-col md:flex-row gap-6 ">
          <aside
            className={`fixed md:static inset-0 z-40 ${
              isFilterOpen ? "block" : "hidden"
            } md:block w-full md:w-64 lg:w-72`}
          >
            <div
              className="md:hidden fixed inset-0 bg-black bg-opacity-50"
              onClick={toggleFilter}
            />
            <div
              className={`fixed md:static right-0 top-0 h-full w-72 bg-white border-teal-500 border-l-2 rounded-l-xl p-2 items-baseline overflow-y-auto transform transition-transform duration-300 ${
                isFilterOpen ? "translate-x-0" : "translate-x-full"
              } md:transform-none`}
            >
              <div className="flex items-center p-2 justify-between">
                <h1 className="text-3xl font-semibold text-teal-600 ">JCKAME</h1>
                <button
                  onClick={toggleFilter}
                  className="md:hidden text-teal-500 hover:text-teal-800"
                >
                  <FaTimes className="text-3xl" />
                </button>
              </div>
              {/* FilterSection in Main */}
              <div className="mt-5 p-2 gap-2 flex-col">
                <div className="flex items-baseline mb-2">
                  <FaFilter className="text-2xl mb-1 text-teal-600 " />
                  <h1 className="text-2xl text-justify font-semibold px-2">Filter</h1>
                </div>
                <FilterContent />
                {/*search section*/}

              </div>
            </div>
          </aside>
          {/* Products Grid */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              {searchResults.length > 0
                ? `Search Results for "${searchQuery}"`
                : "Furniture Sets"}
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
                  {searchResults.length > 0
                    ? "No results match your search."
                    : "No furniture sets available at the moment."}
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