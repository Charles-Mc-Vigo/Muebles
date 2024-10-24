import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import {FaLongArrowAltRight,FaLongArrowAltLeft } from "react-icons/fa";
import { IoReturnUpBack } from "react-icons/io5";
import Header from "./Header";
import Footer from "./Footer";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [furnitureData, setFurnitureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
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
    setSelectedMaterial(null);
    setSelectedSize(null);
  };

  const handleMaterialClick = (material) => {
    setSelectedMaterial(material.name);
  };

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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!furnitureData)
    return <div className="text-center">No furniture found</div>;

  const FAQAccordion = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };
    return (
      <div className="border-b border-gray-300">
        <button
          onClick={toggleAccordion}
          className="flex justify-between items-center w-full py-4 text-left focus:outline-none overflow-hidden"
        >
          <h3 className="text-lg font-medium text-gray-800">{question}</h3>
          <span className="text-lg text-gray-600">
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </button>
        {isOpen && <div className="py-4 text-gray-700 text-md">{answer}</div>}
      </div>
    );
  };

  const faqItems = [
    { question: "Description?", answer: furnitureData.description },
    { question: "Specification", answer: "None" },
    { question: "Warranty", answer: "None" },
    { question: "Care Guide", answer: "None" },
  ];

  return (
    <section className="bg-white">
      <Header />
      <div className="container mx-auto p-5 flex flex-col lg:flex-row">
        {/* Combined: Product Image and Details */}
        <div className="flex flex-col lg:flex-row lg:w-full justify-center mt-10">
          {/* Left: Product Image */}
          <div className="flex flex-col lg:w-[800px] lg:h-[800px] p-2 border-2 border-black bg-white rounded-lg shadow-md relative">
			
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="text-teal-600 mb-4 lg:mb-0 lg:mr-5"
            >
              <IoReturnUpBack size={50} />
            </button>
            {/* Main container with gray background */}
            <div className="flex-grow flex flex-col items-center p-4 border-2">
              {/* Main furniture image */}
              <div className="flex-grow flex items-center justify-center ">
                {furnitureData.images && furnitureData.images.length > 0 && (
                  <img
                    src={`data:image/jpeg;base64,${furnitureData.images[currentImageIndex]}`}
                    alt={furnitureData.name}
                    className="w-3/4 h-full object-contain"
                  />
                )}
              </div>

              {/* Thumbnail navigation */}
              <div className="flex items-center justify-center  space-x-4">
                {/* Left button for image navigation */}
                <button onClick={handlePreviousImage}>
                  <FaLongArrowAltLeft size={30} />
                </button>

                {/* Thumbnails */}
                <div className="flex space-x-2">
                  {furnitureData.images.map((image, index) => (
                    <img
                      key={index}
                      src={`data:image/jpeg;base64,${image}`}
                      alt={`Image ${index + 1} of ${furnitureData.name}`}
                      className={`w-20 h-20 object-contain border-2 rounded cursor-pointer transition ${
                        currentImageIndex === index
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    />
                  ))}
                </div>

                {/* Right button for image navigation */}
                <button onClick={handleNextImage}>
                  <FaLongArrowAltRight size={30} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex-1 lg:max-w-[400px] lg:h-[800px] p-5 bg-white border-2 border-gray-300 rounded-lg shadow-md ml-0 lg:ml-5">
            <h1 className="text-3xl font-bold">{furnitureData.name}</h1>
            <div className="mt-2">
              <h2 className="text-lg font-semibold">Price</h2>
              <p className="border-b-2 border-gray-400">
                ₱ {furnitureData.price}
              </p>
            </div>
            {/* Color Selection */}
            <div className="mb-4 rounded-md p-2">
              <label className="block font-semibold">
                Colors: {selectedColor || "None"}
              </label>
              <div className="flex flex-wrap gap-2">
                {furnitureData.colors?.map((color) => (
                  <div
                    key={color._id}
                    onClick={() => handleColorClick(color)}
                    className={`w-16 h-16 rounded-full border cursor-pointer relative flex items-center justify-center transition-transform transform hover:scale-110 ${
                      selectedColor === color.name
                        ? "border-blue-600"
                        : "border-gray-400"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Furniture Materials */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Materials</h2>
              <div className="flex space-x-2 flex-wrap">
                {furnitureData.materials?.map((material) => (
                  <span
                    key={material.id}
                    onClick={() => handleMaterialClick(material)}
                    className={`border px-2 py-1 rounded-md cursor-pointer transition ${
                      selectedMaterial === material.name
                        ? "bg-blue-600 text-white"
                        : "text-gray-800"
                    }`}
                  >
                    {material.name}
                  </span>
                ))}
              </div>
            </div>
            {/* Furniture Sizes */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Sizes</h2>
              <div className="flex space-x-2 flex-wrap">
                {furnitureData.sizes?.map((size) => (
                  <span
                    key={size.id}
                    onClick={() => handleSizeClick(size)}
                    className={`border px-2 py-1 rounded-md cursor-pointer transition ${
                      selectedSize === size.label
                        ? "bg-blue-600 text-white"
                        : "text-gray-800"
                    }`}
                  >
                    {size.label}
                  </span>
                ))}
              </div>
            </div>
            {/* FAQ Section */}
            <div className="mt-4">
              {faqItems.map((item, index) => (
                <FAQAccordion
                  key={index}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}

export default ProductDetails;
