import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Card = ({ image, title, link }) => {
  return (
    <Link to={link}>
      <div className="bg-white rounded-lg overflow-hidden shadow-lg text-center font-serif cursor-pointer">
        <img src={image} alt={title} className="w-full h-50 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

const CollectionSection = () => {
  const items = [
    { image: "/landingimage/livingroom.svg", title: "Living Room Collection", link: "/living-room" },
    { image: "/landingimage/Dining.svg", title: "Dining Room Collection", link: "/dining-room" },
    { image: "/landingimage/bedroom.svg", title: "Bed Room Collection", link: "/bed-room" }
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 ">
      <h2 className="text-3xl font-bold text-center mb-4">
        Discover Our Beautiful Wood Furniture Collection
      </h2>
      <p className="text-center mb-8">
        At JCKAME, we offer a wide selection of high-quality wood furniture that combines style and durability. Browse our collection to find the perfect piece for your home.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl m-auto mt-10 p-4">
        {items.map((item, index) => (
          <Card key={index} image={item.image} title={item.title} link={item.link} />
        ))}
      </div>
      <div className="mt-5 text-center">
        <h3 className="text-2xl font-bold">Popular Collections</h3>
      </div>
    </div>
  );
};

export default CollectionSection;
