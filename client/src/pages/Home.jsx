import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Header />
      
      <div className="flex h-screen m-10">

        {/* Left Section - Filter */}
        <div className="w-1/5 border-2 border-oliveGreen p-4 flex flex-col mr-5 rounded-tr-lg">
          <div className="ml-2 font-mono font-normal text-xl text-left">
            <p className="mb-5">Filter by:</p>
            <p className="mb-3">Category</p>

            {/* Filter Options */}
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Living Room
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Dining Room
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Bedroom
              </label>
            </div>
          </div>
        </div>

        {/* Right Section - Main Content */}
        <div className="w-4/5 p-4 border-2 border-oliveGreen flex items-center justify-center">
          <p>Main Content</p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
