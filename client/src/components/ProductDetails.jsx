import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import {
  MdOutlineShoppingCart,
  MdInfoOutline,
  MdVerified,
  MdRateReview,
} from "react-icons/md";

function ProductDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("productInfo");
  const [furnitureData, setFurnitureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        if (data) {
          setFurnitureData(data);
        } else {
          throw new Error("Furniture data not found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFurnitureDetails();
  }, [id]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!furnitureData)
    return <div className="text-center">No furniture found</div>;

  return (
    <section>
      <Header />
      <div className="flex justify-center items-centers">
        <div className="w-full max-w-7xl h-full flex items-center justify-center bg-gray-200 mx-5 mb-2">
          {/* Left Side: Product Image (Centered in 3/4 height) */}
          <div className="flex justify-center items-center h-3/4  m-5">
            <div className="aspect-square w-3/4 border rounded-lg overflow-hidden">
              <img
                src={`data:image/jpeg;base64,${furnitureData.image}`}
                alt={furnitureData.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Right Side with Product Details (3/4 Height) */}
          <div className="w-1/3 h-3/4 flex flex-col justify-center space-y-6 bg-gray-300 p-2 mr-2 mb-2 mt-2">
            <h1 className="text-3xl font-bold text-black">
              {furnitureData.name}
            </h1>
            <p className="mt-4 text-black-600 text-justify">
              {furnitureData.description}
            </p>

            {/* Product Info (Price, Colors, Materials, Sizes) */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-black-700">Price</h2>
                <p className="text-black">PHP {furnitureData.price}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-black-700">Colors</h2>
                <div className="flex items-center space-x-2">
                  {furnitureData.colors?.length ? (
                    furnitureData.colors.map((color) => (
                      <div
                        key={color.id}
                        className="grid grid-cols-3 items-center"
                      >
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: color.rgb }}
                        />
                        <span className="ml-2 text-black-700">{color.name}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-black-600">No colors available</span>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-black-700">Materials</h2>
                <div className="flex flex-wrap gap-2">
                  {furnitureData.materials?.map((material) => (
                    <button
                      key={material.id}
                      className="px-4 py-2 border rounded-md hover:bg-gray-200 hover:text-black transition-colors"
                    >
                      {material.name}
                    </button>
                  ))}
                </div>
              </div>
            <div>
              <h2 className="text-lg font-semibold text-black-700">Sizes</h2>
              <p>{furnitureData.sizes.map((size) => size.label).join(", ")}</p>
            </div>

            {/* <Link
            to="/dashboard"
            className="inline-block bg-green-100 hover:bg-green-200 text-green-700 px-6 py-3 rounded-md transition-colors duration-300"
          >
            Go back
          </Link> */}
          </div>
        </div>
        </div>
      </div>

      {/* Navigation Section */}
      <section className="w-full py-2 mt-2 mb-2">
        <div className="flex justify-center space-x-6 border-b border-gray-300 mb-0">
       
          <button
            className={`flex items-center pb-2 ${
              activeTab === "productInfo" ? "border-b-2 border-black" : ""
            }`}
            onClick={() => setActiveTab("productInfo")}
          >
            <span className="mr-2 text-3xl">
              <MdInfoOutline />
            </span>
            Product Info
          </button>
          <button
            className={`flex items-center pb-2 ${
              activeTab === "recommendedProduct" ? "border-b-2 border-black" : ""
            }`}
            onClick={() => setActiveTab("recommendedProduct")}
          >
            Recommended Product
          </button>
          <button
            className={`flex items-center pb-2 ${
              activeTab === "warranty" ? "border-b-2 border-black" : ""
            }`}
            onClick={() => setActiveTab("warranty")}
          >
            <span className="mr-2 text-3xl">
              <MdVerified />
            </span>
            Warranty
          </button>
          <button
            className={`flex items-center pb-2 ${
              activeTab === "review" ? "border-b-2 border-black" : ""
            }`}
            onClick={() => setActiveTab("review")}
          >
            <span className="mr-2 text-3xl">
              <MdRateReview />
            </span>
            Review
          </button>
        </div>
        {/* Display the selected content below */}
        <div >
      
          {activeTab === "productInfo" && (
            <div>
              <h2 className="text-xl font-semibold">Product Information</h2>
              <p>
                Here you will display the details of the product, such as
                dimensions, materials, and more.
              </p>
            </div>
          )}
          {activeTab === "recommendedProduct" && (
            <div>
              <h2 className="text-xl font-semibold">Product Information</h2>
              <p>
                Here you will display the recommendedProduct
                dimensions, materials, and more.
              </p>
            </div>
          )}
          {activeTab === "warranty" && (
            <div>
              <h2 className="text-xl font-semibold">Warranty Information</h2>
              <p>
                Warranty details about the product can go here, like duration
                and coverage information.
              </p>
            </div>
          )}
          {activeTab === "review" && (
            <div>
              <h2 className="text-xl font-semibold">Customer Reviews</h2>
              <p>
                Here you can show customer reviews, ratings, and feedback for
                the product.
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </section>
  );
}

export default ProductDetails;
