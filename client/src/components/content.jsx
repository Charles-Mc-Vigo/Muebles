import React from "react";

export default function Content() {
  return (
    <div className="flex flex-col lg:flex-row max-w-7xl m-auto mt-10">
      <h1 className="text-4xl lg:text-7xl mb-4 lg:mb-0 lg:mr-4">
        Discover the Beauty of Handcrafted Wood Furniture!
      </h1>
      <img
        className="w-1/2 max-w-full lg:max-w-800px h-auto"
        src="/furniture.jpg"
        alt="furniture"
      />
    </div>
  );
}
