import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  const furnitureItems = [
    {
      category: "Living Room",
      items: [
        { name: "Sofa", image: "https://via.placeholder.com/150x150?text=Sofa" },
        { name: "Armchair", image: "https://via.placeholder.com/150x150?text=Armchair" },
        { name: "Coffee Table", image: "https://via.placeholder.com/150x150?text=Coffee+Table" },
        { name: "TV Stand", image: "https://via.placeholder.com/150x150?text=TV+Stand" },
        { name: "Bookshelf", image: "https://via.placeholder.com/150x150?text=Bookshelf" },
        { name: "Ottoman", image: "https://via.placeholder.com/150x150?text=Ottoman" },
        { name: "Side Table", image: "https://via.placeholder.com/150x150?text=Side+Table" },
        { name: "Recliner", image: "https://via.placeholder.com/150x150?text=Recliner" },
      ],
    },
    {
      category: "Dining Room",
      items: [
        { name: "Dining Table", image: "https://via.placeholder.com/150x150?text=Dining+Table" },
        { name: "Dining Chairs", image: "https://via.placeholder.com/150x150?text=Dining+Chairs" },
        { name: "Buffet", image: "https://via.placeholder.com/150x150?text=Buffet" },
        { name: "Bar Cart", image: "https://via.placeholder.com/150x150?text=Bar+Cart" },
        { name: "Bench", image: "https://via.placeholder.com/150x150?text=Bench" },
      ],
    },
    {
      category: "Bedroom",
      items: [
        { name: "Bed Frame", image: "https://via.placeholder.com/150x150?text=Bed+Frame" },
        { name: "Nightstand", image: "https://via.placeholder.com/150x150?text=Nightstand" },
        { name: "Dresser", image: "https://via.placeholder.com/150x150?text=Dresser" },
        { name: "Wardrobe", image: "https://via.placeholder.com/150x150?text=Wardrobe" },
        { name: "Vanity", image: "https://via.placeholder.com/150x150?text=Vanity" },
      ],
    },
    {
      category: "Office",
      items: [
        { name: "Desk", image: "https://via.placeholder.com/150x150?text=Desk" },
        { name: "Office Chair", image: "https://via.placeholder.com/150x150?text=Office+Chair" },
        { name: "Bookshelf", image: "https://via.placeholder.com/150x150?text=Bookshelf" },
        { name: "Filing Cabinet", image: "https://via.placeholder.com/150x150?text=Filing+Cabinet" },
      ],
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const filteredItems = furnitureItems
    .filter(
      (category) =>
        selectedCategories.length === 0 || selectedCategories.includes(category.category)
    )
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => item.name.toLowerCase().includes(searchTerm)),
    }));

  return (
    <>
      <Header />

      <div className="flex flex-col md:flex-row h-auto md:h-screen m-5 md:m-10">
        {/* Left Section - Filter */}
        <div className="w-full md:w-1/5 border-2 border-oliveGreen p-4 flex flex-col mb-5 md:mb-0 md:mr-5 rounded-lg">
          <div className="font-mono font-normal text-xl">
            <p className="mb-5">Filter by:</p>
            <p className="mb-3">Category</p>

            {/* Filter Options */}
            <div className="flex flex-col space-y-2">
              {["Living Room", "Dining Room", "Bedroom"].map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    onChange={() => handleCategoryChange(category)}
                    checked={selectedCategories.includes(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Main Content */}
        <div className="w-full md:w-4/5 p-4 border-2 border-oliveGreen overflow-y-auto rounded-lg">
          <input
            type="text"
            placeholder="Search items..."
            className="mb-4 p-2 border rounded w-full"
            onChange={handleSearch}
            value={searchTerm}
          />

          {/* Display filtered items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredItems.map((category) =>
              category.items.map((item) => (
                <div key={item.name} className="border p-2 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="mb-2 w-full h-auto max-w-[150px] mx-auto"
                  />
                  <p className="text-center text-sm">{item.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
