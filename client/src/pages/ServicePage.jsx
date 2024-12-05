import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";


const servicesData = [
  {
    category: "Living Room",
    description:
      "We offer repair and repaint services for living room furniture to ensure your space remains stylish and functional.",
    icon: "🛋️",
  },
  {
    category: "Bedroom",
    description:
      "From installation of beds to restoration of dressers, our bedroom furniture services cater to your comfort and convenience.",
    icon: "🛏️",
  },
  {
    category: "Dining Room",
    description:
      "Keep your dining area pristine with our expert repair and repaint services for chairs, tables, and more.",
    icon: "🍽️",
  },
  {
    category: "Door",
    description:
      "Enhance your home with professional door repair, repaint, and installation services for both panel and flush doors.",
    icon: "🚪",
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