import React from "react";

const FAQPage = () => {
  return (
    <div className="max-w-7xl mx-auto mt-10 w-full py-4 px-4 md:px-8 font-serif">
      <div className="flex flex-col md:flex-row md:justify-between items-start">
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-bold text-left mb-4">FAQ</h2>
          <p className="text-left text-base md:text-lg text-gray-700 mb-6">
            We are here to help every step of the way as quickly and conveniently as possible so you can go back to relaxing on your JCKAME wood furniture with peace of mind.
          </p>
          <p className="font-semibold text-base md:text-lg">
            Our customer support is available daily: 7am-5pm. Average answer time: 30m
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
