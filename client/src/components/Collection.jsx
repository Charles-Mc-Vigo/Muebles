import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Card = ({ image, title, link }) => {
  return (
    <Link to={link}>
      <div className="bg-white rounded-lg overflow-hidden shadow-lg text-center font-serif cursor-pointer">
        <div className="overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-50 object-cover transform transition-transform duration-300 ease-in-out hover:scale-110"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

const CollectionSection = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update isMobile state based on screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const items = [
    { image: "/landingimage/livingroom.svg", title: "Living Room Collection", link: "/living-room" },
    { image: "/landingimage/Dining.svg", title: "Dining Room Collection", link: "/dining-room" },
    { image: "/landingimage/bedroom.svg", title: "Bed Room Collection", link: "/bed-room" }
  ];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-center mb-4">
        Discover Our Beautiful Wood Furniture Collection
      </h2>
      <p className="text-center mb-8">
        At JCKAME, we offer a wide selection of high-quality wood furniture that combines style and durability. Browse our collection to find the perfect piece for your home.
      </p>

      {/* Conditional rendering based on screen size */}
      {isMobile ? (
        <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          swipeable
          emulateTouch
          showStatus={false}      
          showIndicators={false}  
          showArrows={false}     
        >
          {items.map((item, index) => (
            <div key={index}>
              <Card image={item.image} title={item.title} link={item.link} />
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl m-auto mt-10 p-4">
          {items.map((item, index) => (
            <Card key={index} image={item.image} title={item.title} link={item.link} />
          ))}
        </div>
      )}

      <div className="mt-5 text-center">
        <h3 className="text-2xl font-bold">Popular Collections</h3>
      </div>
    </div>
  );
};

export default CollectionSection;
