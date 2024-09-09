// ProductPage.jsx
import React from 'react';

const ProductPage = () => {
  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Product Image and Thumbnails */}
      <div className="flex flex-col">
        {/* Main Image */}
        <div className="w-full h-80 bg-gray-200 rounded-md mb-4">
          <img src="/path/to/main-image.jpg" alt="Product" className="object-cover w-full h-full rounded-md" />
        </div>
        {/* Thumbnails */}
        <div className="flex space-x-2">
          <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
          <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
          <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
          <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col space-y-4">
        {/* Product Title */}
        <h1 className="text-2xl font-bold">Solid Wood Wardrobe Cabinet</h1>

        {/* Ratings & Sold Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-black">
            <span className="text-xl">&#9733;</span>
            <span className="ml-1 text-sm">4.3</span>
          </div>
          <span className="text-sm text-gray-500">(0 Sold)</span>
        </div>

        {/* Price */}
        <div className="text-2xl font-semibold text-green-300">
          ₱5,000 - ₱10,000
        </div>
        <span className="line-through text-gray-500">₱10,000</span>
        <span className="text-green-500">15% OFF</span>

        {/* Options (Size / Color) */}
        <div>
          <h3 className="text-lg font-semibold">Select Size</h3>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <button className="border border-gray-300 py-2 text-sm rounded-md">60x45x180</button>
            <button className="border border-gray-300 py-2 text-sm rounded-md">80x40x180</button>
            <button className="border border-gray-300 py-2 text-sm rounded-md">120x45x180</button>
          </div>
        </div>

        {/* Quantity Selection */}
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Quantity</span>
          <div className="flex items-center border border-gray-300 rounded-md">
            <button className="px-2 py-1">-</button>
            <input type="text" value="1" className="w-10 text-center" />
            <button className="px-2 py-1">+</button>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="text-sm text-gray-500">
          Shipping Fee: ₱490 to Boac, Marinduque
        </div>

        {/* Add to Cart / Buy Now */}
        <div className="flex space-x-4">
          <button className="bg-gray-200 text-black py-2 px-4 rounded-md">Add to Cart</button>
          <button className="bg-green-300 text-black py-2 px-4 rounded-md">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
