import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";

export default function Hero() {
  const images = [
    "/Advertisement/carouselimages/1.png",
    "/Advertisement/carouselimages/2.png",
    "/Advertisement/carouselimages/3.png",
    "/Advertisement/carouselimages/4.png",
    "/Advertisement/carouselimages/5.png",
    "/Advertisement/carouselimages/6.png",
  ];

  const navigate = useNavigate();
  const toHomePage = () => {
    navigate("/home");
  };

  return (
    <div>
      {/* Carousel Section */}
      <section className="relative h-3/4">
        <div className="h-3/4 lg:h-3/4 md:h-1/2 sm:h-1/3 my-5 p-5">
          <Carousel images={images} />
        </div>

        <div
          className="flex flex-col lg:flex-row h-3/4 lg:h-screen items-center lg:items-stretch my-5 p-5 border-2  "
          style={{
            backgroundImage: "url(./landingimage/JCKAME.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex-1 flex justify-center items-center lg:justify-end p-6 lg:p-10">
            <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 max-w-sm lg:max-w-2xl w-full">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 text-center lg:text-left">
                Discover the Beauty of Handcrafted Wood Furniture!
              </h1>
              <p className="text-lg lg:text-xl mb-6 text-black text-center lg:text-left">
                Experience the timeless elegance and natural warmth of our
                exquisite wood furniture collection.
              </p>
              <div className="flex justify-center lg:justify-start">
                <button
                  className="flex items-center text-base lg:text-lg font-semibold gap-3 rounded-md py-3 px-6 bg-teal-500 text-white hover:opacity-80 transition-all"
                  onClick={toHomePage}
                >
                  Shop now!
                  <FaShoppingCart />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
