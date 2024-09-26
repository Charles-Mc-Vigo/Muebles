import React, { useState, useEffect } from "react";
import axios from "axios";

const ItemList = () => {
  const [products, setProducts] = useState([]);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-2 h-[80vh]">
      <h1 className="text-3xl font-bold mb-4 text-center">Displayed Product</h1>
      <div className="h-full overflow-y-auto p-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 border-2 p-5 border-oliveGreen"> 
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow-lg rounded-lg overflow-clip border border-gray-200"
                style={{ width: '240px', height: '360px', margin: '1px' }}
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
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemList;
