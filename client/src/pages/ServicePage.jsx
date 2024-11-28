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
    <main>
      <Header />
      <section className="bg-gray-100 py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">{service.icon}</div>
                <h2 className="text-2xl font-semibold">{service.category}</h2>
              </div>
              <p className="text-gray-700">{service.description}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default ServicePage;
