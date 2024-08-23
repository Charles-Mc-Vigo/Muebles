import React from "react";

export default function FurnitureList() {
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

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Furniture Items</h1>
      <div className="max-w-6xl mx-auto space-y-8">
        {furnitureItems.map((category, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {category.category} Furniture
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {category.items.map((item, idx) => (
                <li key={idx} className="flex flex-col items-center text-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 object-cover mb-2 rounded-md"
                  />
                  <p className="text-gray-600">{item.name}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
