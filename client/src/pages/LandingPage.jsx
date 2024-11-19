import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Collection from "../components/Collection";
import FAQPage from "../components/FAQpage";
import FAQAccordion from "../components/FAQAccordion";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="flex flex-col">
      <Header />
      <Hero />

      {/* Collection Section */}
      <div className="lg:col-span-2 p-5  m-5 h-3/4">
        <Collection />
      </div>

      {/* FAQ Section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start gap-2 p-2  m-5 max-w-full max-h-3/4 ">
        <div className="md:w-1/2">
          <FAQPage />
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0">
          <FAQAccordion />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
