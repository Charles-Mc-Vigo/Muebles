import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import {
  FaChevronUp,
  FaChevronDown,
  FaComments,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

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
      <div className="border-b-2 border-black">
        <button
          onClick={toggleAccordion}
          className="flex justify-between items-center w-full py-4 text-left focus:outline-none overflow-hidden"
        >
          <h3
            className="text-xl font-medium text-black"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {question}
          </h3>
          <span className="text-lg text-black">
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </button>
        {isOpen && (
          <div
            className="py-4 text-black text-lg text-justify"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {answer}
          </div>
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
      <div className="flex justify-center items-start p-5 border-t-2 border-black">
        {/* Left: Product Image */}
        <div className="w-[639px] h-[639px] p-5 flex justify-center items-center ">
          <img
            src={`data:image/jpeg;base64,${furnitureData.image}`}
            alt={furnitureData.name}
            className="w-full h-full object-contain "
          />
        </div>

        {/* Right: Product Details */}
        <div className="w-[462px] h-[1057px] p-5 flex flex-col justify-between border-2 border-black">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {furnitureData.name}
            </h1>

            <div className="mt-2">
              <h2 className="text-lg font-semibold">Price</h2>
              <p
                className="border-b-2 border-black"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                ₱ {furnitureData.price}
              </p>
            </div>

            {/* Color Selection */}
            <div className="mb-4 rounded-md p-2">
              <label className="block font-semibold ">
                Colors: {selectedColor || "None"}
              </label>
              <div className="flex flex-wrap gap-4">
                {furnitureData.colors?.map((color) => (
                  <div
                    key={color._id}
                    onClick={() => handleColorClick(color)}
                    className={`w-10 h-10 rounded-full border  cursor-pointer ${
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
              <h2
                className="text-lg font-semibold"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Materials
              </h2>
              <div className="flex space-x-2">
                {furnitureData.materials?.map((material) => (
                  <span
                    key={material.id}
                    onClick={() => handleMaterialClick(material)}
                    className={`border px-2 py-1 rounded-md cursor-pointer border-black ${
                      selectedMaterial === material.name
                        ? "bg-gray-400 text-black"
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
              <div className="flex space-x-2 ">
                {furnitureData.sizes?.map((size) => (
                  <span
                    key={size.id}
                    onClick={() => handleSizeClick(size)}
                    className={`border px-2 py-1 rounded-md cursor-pointer ${
                      selectedSize === size.label
                        ? "bg-gray-400 text-black"
                        : ""
                    }`}
                  >
                    {size.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t-2 mt-2 flex border-black"></div>

            <div className="flex gap-5 mt-3  ">
              <button className="border-2 border-black p-2 rounded-t-lg ">
                Buy Now
              </button>
              <button className="border-2 p-3 border-black rounded-t-lg ">
                Add to Cart
              </button>
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
              <h1 className="text-2xl font-bold ">
                Questions? We're here to help!
              </h1>
              <p className="text-lg mt-2">
                Available Monday - Saturday, 7:00 AM - 5:00 PM.
              </p>
              <div className="flex space-x-2 mt-4">
                <button className="flex items-center border-2 border-oliveGreen rounded px-4 py-2 hover:bg-red-500 hover:text-white transition">
                  <FaComments className="h-5 w-5 mr-2" />
                  Live Chat
                </button>
                <button className="flex items-center border-2 border-oliveGreen rounded px-4 py-2 hover:bg-red-500 hover:text-white transition">
                  <FaEnvelope className="h-5 w-5 mr-2" />
                  Email Us
                </button>
                <button className="flex items-center border-2 border-oliveGreen rounded px-4 py-2 hover:bg-red-500 hover:text-white transition">
                  <FaPhoneAlt className="h-5 w-5 mr-2" />
                  Call Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      <div className="w-[1329px] h-[629px] p-5 border-2 border-black mt-10 mx-auto mb-5">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
          Recommended Products
        </h2>
        <div>
          {/* Placeholder or dynamic content for recommended products */}
          <p>Product recommendations will appear here...</p>
        </div>
      </div>

      <Footer />
    </section>
  );
}

export default ProductDetails;
