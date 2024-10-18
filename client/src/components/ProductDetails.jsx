import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

function ProductDetails() {
  const { id } = useParams();
  const [furnitureData, setFurnitureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchFurnitureDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/furnitures/${id}`
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
      <div className="border-b border-green-700">
        <button
          onClick={toggleAccordion}
          className="flex justify-between items-center w-full py-4 text-left focus:outline-none overflow-hidden"
        >
          <h3 className="text-xl font-medium text-black font-sans">
            {question}
          </h3>
          <span className="text-lg text-black">
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </button>
        {isOpen && (
          <div className="py-4 text-black font-sans text-lg">{answer}</div>
        )}
      </div>
    );
  };

  const faqItems = [
    {
      question: "Description?",
      answer: furnitureData.description,
    },
    {
      question: "Specification",
      answer: "None",
    },
    {
      question: "Warranty",
      answer: "None",
    },
    {
      question: "Care Guide",
      answer: "None",
    },
  ];

  return (
    <section>
      <Header />
      <div className="flex justify-center items-start p-5 border-2">
        {/* Left: Product Image */}
        <div className="w-[639px] h-[639px] p-5 flex justify-center items-center border-2">
          <img
            src={`data:image/jpeg;base64,${furnitureData.image}`}
            alt={furnitureData.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right: Product Details */}
        <div className="w-[462px] h-[1057px] p-5 flex flex-col justify-between border-2">
          <div>
            <h1 className="text-3xl font-bold">{furnitureData.name}</h1>
            <div className="mt-2">
              <h2 className="text-lg font-semibold">Price</h2>
              <p className="border-b-2 border-black">₱ {furnitureData.price}</p>
            </div>

            {/* Color Selection */}
            <div className="mb-4 rounded-md p-2">
              <label className="block font-semibold">
                Colors: {selectedColor || "None"}
              </label>
              <div className="flex flex-wrap gap-4">
                {furnitureData.colors?.map((color) => (
                  <div
                    key={color._id}
                    onClick={() => handleColorClick(color)}
                    className={`w-10 h-10 rounded-full border cursor-pointer ${
                      selectedColor === color.name
                        ? "border-blue-600"
                        : "border-gray-400"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Furniture Materials */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Materials</h2>
              <div className="flex space-x-2">
                {furnitureData.materials?.map((material) => (
                  <span
                    key={material.id}
                    onClick={() => handleMaterialClick(material)}
                    className={`border px-2 py-1 rounded-md cursor-pointer ${
                      selectedMaterial === material.name
                        ? "bg-blue-600 text-white"
                        : ""
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
              <div className="flex space-x-2">
                {furnitureData.sizes?.map((size) => (
                  <span
                    key={size.id}
                    onClick={() => handleSizeClick(size)}
                    className={`border px-2 py-1 rounded-md cursor-pointer ${
                      selectedSize === size.label
                        ? "bg-blue-600 text-white"
                        : ""
                    }`}
                  >
                    {size.label}
                  </span>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            {faqItems.map((item, index) => (
              <FAQAccordion
                key={index}
                question={item.question}
                answer={item.answer}
              />
            ))}
            <div className="mt-5">
              <h1 className="text-2xl font-bold">Question?</h1>
              <p className="text-lg mt-2">
                We're here to help! Available Monday - Saturday, 7:00 AM - 5:00
                PM.
              </p>
            </div>
          </div>
        </div>
        <div></div>
      </div>

      <Footer />
    </section>
  );
}

export default ProductDetails;
