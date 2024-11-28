import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const services = [
  {
    title: "Custom Furniture Design",
    description: "Work with our designers to create unique pieces that fit your style and needs.",
    icon: "🪑", // You can replace this with an actual icon or image.
  },
  {
    title: "Furniture Restoration",
    description: "Revive your old furniture with our restoration services to bring back its original beauty.",
    icon: "🛠️", 
  },
  {
    title: "Delivery and Assembly",
    description: "We offer professional delivery and assembly services for your convenience.",
    icon: "📦", 
  },
];

const ServicePage = () => {
  return (
    <div className="min-h-screen">
      <Header /> 

      <h1 className="text-4xl font-bold text-center mt-40 mb-6">Our Services</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ml-2 mr-2">
        {services.map((service, index) => (
          <div key={index} className="bg-gray-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-4xl mb-4">{service.icon}</div>
            <h2 className="text-2xl font-semibold mb-2">{service.title}</h2>
            <p className="text-black">{service.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <Footer />
      </div>

    
    </div>
  );
};

export default ServicePage;
