import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Footer from "./Footer";
import { IoMdArrowRoundBack } from "react-icons/io";
import LoadingSpinner from "./LoadingSpinner";
import ProductReview from "./ProductReview";

function ProductDetails({ admin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [furnitureData, setFurnitureData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [price, setPrice] = useState(null);
  const [ECT, setECT] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  // console.log(price);

  useEffect(() => {
    setLoading(true);

    const fetchFurnitureDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/furnitures/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch furniture details");
        }
        const data = await response.json();
        setFurnitureData(data);
        setPrice(data.price || 0);
        setECT(data.furnitureType.ECT);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFurnitureDetails();
  }, [id]);

  const handleColorClick = (color) => {
    setSelectedColor(color.name);
    // setSelectedMaterial(null);
    // setSelectedSize(null);
  };

  const handleMaterialClick = (material) => {
    setSelectedMaterial(material.name);
    setPrice(material.price);
    console.log(price);
  };

  // console.log(selectedMaterial);
  const handleSizeClick = (size) => {
    setSelectedSize(size.label);
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? furnitureData.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === furnitureData.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const addToCart = async (e) => {
    e.preventDefault();
    if (!selectedColor || !selectedMaterial || !selectedSize) {
      toast.error("Please select color, material, and size.");
      return;
    }
    const item = {
      furnitureId: id,
      quantity: 1,
      color: selectedColor,
      material: selectedMaterial,
      size: selectedSize,
      price: price,
      ECT: ECT,
    };

    console.log(item);

    // console.log(item)
    try {
      const response = await fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(item),
      });
      const data = await response.json();
      if (!data.ok) {
        toast.error(data.error);
      }
      toast.success(data.success);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Error adding item to cart. Please try again.");
    }
    setLoading(false);
  };
  // content tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div
            id="description"
            className="grid items-center text-justify p-4 bg-white shadow-xl border-teal-500 border rounded-lg max-w-full sm:p-6 md:p-8 lg:px-12"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4 lg:mb-6 ml-2 sm:ml-5">
              Product Description
            </h2>
            <p className="text-gray-800 mb-3 sm:mb-4 lg:mb-6 ml-2 sm:ml-5">
              {furnitureData.description || "No description available."}
            </p>
            <div className="border-t border-teal-500 pt-4 sm:pt-6 lg:pt-8">
              {/* Materials Section */}
              <ul className="mb-4 sm:mb-6">
                <li className="ml-2 sm:ml-5">
                  <h3 className="text-lg sm:text-xl font-semibold">
                    Materials:
                  </h3>
                  {furnitureData.materials?.length > 0 ? (
                    furnitureData.materials.map((material, index) => (
                      <p
                        key={index}
                        className="text-gray-700 text-sm sm:text-base"
                      >
                        {material.name || "N/A"}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500">No materials available.</p>
                  )}
                </li>
              </ul>

              {/* Colors Section */}
              <ul className="mb-4 sm:mb-6 border-t-2 border-teal-500 pt-5 sm:pt-6">
                <li className="ml-2 sm:ml-5">
                  <h3 className="text-lg sm:text-xl font-semibold">Colors:</h3>
                  {furnitureData.colors?.length > 0 ? (
                    furnitureData.colors.map((color, index) => (
                      <p
                        key={index}
                        className="text-black text-sm sm:text-base"
                      >
                        {color.name || "N/A"}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500">No colors available.</p>
                  )}
                </li>
              </ul>

              {/* Sizes Section */}
              <ul className="mb-4 sm:mb-6 border-t-2 pt-5 sm:pt-6 border-teal-500">
                <li className="ml-2 sm:ml-5">
                  <h3 className="text-base sm:text-lg font-normal">Sizes:</h3>
                  {furnitureData.sizes?.length > 0 ? (
                    furnitureData.sizes.map((size, index) => (
                      <p
                        key={index}
                        className="text-black text-sm sm:text-base"
                      >
                        {size.label || "N/A"}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500">No sizes available.</p>
                  )}
                </li>
              </ul>

              {/* Disclaimer Section */}
              <ul className="mb-4 sm:mb-6 pt-5 sm:pt-6 border-t-2 border-teal-500">
                <li className="ml-2 sm:ml-5">
                  <h3 className="text-xl sm:text-2xl font-semibold">
                    Disclaimer
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg font-normal">
                    PRODUCT IMAGE AND COLOR Each product on the Muebles website
                    is a representation of the actual product of JCKAME. We
                    attempt to display product images as accurately as possible.
                    However, due to lighting and different devices you might be
                    using, the color in the image may vary slightly from the
                    actual color of the product.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        );
      case "warranty":
        return (
          <div
            id="warranty"
            className="p-4 sm:p-6 md:p-8 bg-white shadow-xl border-teal-500 border rounded-lg max-w-full"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Warranty</h2>
            <p className="text-gray-700 text-sm sm:text-base">
              {furnitureData.warranty || "No warranty information available."}
            </p>
          </div>
        );
      case "review":
        return (
          <div
            id="review"
            className="p-4 sm:p-6 md:p-8 bg-white shadow-xl border-teal-500 border rounded-lg max-w-full"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              Customer Reviews
            </h2>
            <ProductReview />
          </div>
        );
      case "care-guide":
        return (
          <div
            id="care-guide"
            className="p-4 sm:p-6 md:p-8 bg-white shadow-xl border-teal-500 border rounded-lg max-w-full"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Care Guide</h2>
            <p className="text-gray-700 text-sm sm:text-base">
              Tips on how to care for your furniture:
              <ul className="list-disc list-inside mt-2">
                <li>Use a soft cloth for cleaning.</li>
                <li>Avoid direct sunlight exposure.</li>
                <li>Apply protective polish for wood surfaces.</li>
              </ul>
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!furnitureData)
    return <div className="text-center">No furniture found</div>;

  return (
    <section>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className="bg-white">
          <Header isLogin={true} cartCount={true} />
          <div className="w-full h-auto p-5 flex flex-col lg:flex-row">
            <div className="flex flex-col lg:flex-row lg:w-full justify-center p-5">
              <div className="flex flex-col rounded-xl p-5 border-2 border-teal-600 sm:mb-5 md:mb-5 max-w-2/5 shadow-lg shadow-gray-300">
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-500 mr-2 hover:text-teal-600"
                >
                  <IoMdArrowRoundBack size={40} />
                </button>
                <div className="grid grid-cols-1 p-5 items-center h-full w-full">
                  {/* Main Image Section */}
                  <div className="flex flex-col items-center h-full">
                    {furnitureData.images &&
                      furnitureData.images.length > 0 && (
                        <img
                          src={`data:image/jpeg;base64,${furnitureData.images[currentImageIndex]}`}
                          alt={furnitureData.name}
                          className="w-full h-64 sm:h-96 object-cover rounded-md shadow-md" // Responsive height
                        />
                      )}

                    {/* Navigation for Images */}
                    <div className="flex items-center justify-center space-x-4 mt-4">
                      {/* Previous Button */}
                      <button
                        onClick={handlePreviousImage}
                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 shadow-md"
                      >
                        <FaArrowLeft size={24} />
                      </button>

                      {/* Thumbnails Section */}
                      <div className="flex space-x-2 p-2 overflow-x-auto">
                        {furnitureData.images.map((image, index) => (
                          <img
                            key={index}
                            src={`data:image/jpeg;base64,${image}`}
                            alt={`Image ${index + 1} of ${furnitureData.name}`}
                            className={`w-16 h-16 md:w-20 md:h-20 object-contain rounded cursor-pointer border-2 ${
                              currentImageIndex === index
                                ? "border-blue-500"
                                : "border-gray-300"
                            } transition-transform transform hover:scale-105`}
                            onClick={() => handleThumbnailClick(index)}
                          />
                        ))}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={handleNextImage}
                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 shadow-md"
                      >
                        <FaArrowRight size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* right section */}
              <div className="flex-1 max-w-3xl border-2 border-teal-500 p-5 bg-white rounded-lg shadow-lg  lg:ml-5 ">
                <h1 className="text-3xl font-bold">{furnitureData.name}</h1>
                <div className="mt-2">
                  <p className="border-b-2 py-2 border-teal-500 text-2xl mb-3">
                    Price : {price}
                  </p>
                  <p className="text-2xl border-b-2 py-2 border-teal-500 mb-3">
                    Estimated Completion Time (ECT):{" "}
                    {furnitureData.furnitureType.ECT} Days
                  </p>
                </div>
                {/* Color Selection */}
                <div className="mb-4 rounded-md p-2 border-b-2 border-teal-500">
                  <label className="block font-semibold text-2xl">
                    Colors: {selectedColor || "None"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {furnitureData.colors?.map((color) => (
                      <div
                        key={color._id}
                        onClick={() => handleColorClick(color)}
                        className={`w-16 h-16 rounded-full border cursor-pointer relative flex items-center justify-center transition-transform transform hover:scale-110 ${
                          selectedColor === color.name
                            ? "bg-teal-600 text-black"
                            : "text-black"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      ></div>
                    ))}
                  </div>
                </div>
                {/* Materials Section */}
                <div className="mt-4 border-b-2 border-teal-500 pb-4">
                  <h2 className="text-2xl font-semibold">Materials</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-1">
                    {furnitureData.materials?.map((material) => (
                      <span
                        key={material.id}
                        onClick={() => handleMaterialClick(material)}
                        className={`border text-xl border-teal-600 px-2 py-1 rounded-md cursor-pointer transition ${
                          selectedMaterial === material.name
                            ? "bg-teal-600 text-white"
                            : "text-teal-600"
                        }`}
                      >
                        {material.name}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Sizes Section */}
                <div className="mt-2 p-2 ">
                  <h2 className="text-2xl font-semibold">Sizes</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-1">
                    {furnitureData.sizes?.map((size) => (
                      <span
                        key={size.id}
                        onClick={() => handleSizeClick(size)}
                        className={`border mb-2 p-5 text-base border-teal-600 rounded-md cursor-pointer transition ${
                          selectedSize === size.label
                            ? "bg-teal-600 text-white"
                            : "text-teal-600"
                        }`}
                      >
                        {size.label}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Add to Cart Button */}
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={addToCart}
                    disabled={loading}
                    className="text-teal-500 hover:bg-teal-500 hover:text-white border border-teal-500 text-xl font-semibold px-4 rounded-md transition-colors duration-300 flex-1 py-2"
                  >
                    {loading ? "Adding..." : "Add to cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Content Mapping  */}
          <div className="border-t-2 border-teal-500 w-full p-4 sm:p-6 md:p-8">
            <nav className="flex flex-wrap items-center justify-center space-x-4 sm:space-x-8 text-lg sm:text-xl">
              {/* Description Button */}
              <button
                onClick={() => setActiveTab("description")}
                className={`px-4 py-2 rounded-lg transition text-sm sm:text-base md:text-lg ${
                  activeTab === "description"
                    ? "bg-teal-600 text-white"
                    : "hover:text-teal-600"
                }`}
              >
                Description
              </button>

              {/* Warranty Button */}
              <button
                onClick={() => setActiveTab("warranty")}
                className={`px-4 py-2 rounded-lg transition text-sm sm:text-base md:text-lg ${
                  activeTab === "warranty"
                    ? "bg-teal-600 text-white"
                    : "hover:text-teal-600"
                }`}
              >
                Warranty
              </button>

              {/* Review Button */}
              <button
                onClick={() => setActiveTab("review")}
                className={`px-4 py-2 rounded-lg transition text-sm sm:text-base md:text-lg ${
                  activeTab === "review"
                    ? "bg-teal-600 text-white"
                    : "hover:text-teal-600"
                }`}
              >
                Review
              </button>

              {/* How to Care Button */}
              <button
                onClick={() => setActiveTab("care-guide")}
                className={`px-4 py-2 rounded-lg transition text-sm sm:text-base md:text-lg ${
                  activeTab === "care-guide"
                    ? "bg-teal-600 text-white"
                    : "hover:text-teal-600"
                }`}
              >
                How to Care
              </button>
            </nav>
          </div>

          <div className="p-8 bg-white">{renderTabContent()}</div>
          <ToastContainer />
          <Footer />
        </section>
      )}
    </section>
  );
}

export default ProductDetails;
