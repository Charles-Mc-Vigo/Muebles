import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      {/* Background Section */}
      <section className="relative w-full h-96 bg-cover bg-center" 
               style={{ backgroundImage: 'url(/path/to/background-image.jpg)' }}>
        <div className="absolute inset-0 bg-teal-800 bg-opacity-60 flex items-center justify-center">
          <div className="text-center text-white px-6 py-4 max-w-lg">
            <h1 className="text-4xl font-bold mb-4">Our Organization</h1>
            <p className="text-lg">
              We are dedicated to providing high-quality handcrafted furniture, combining traditional craftsmanship with modern design. Our mission is to enhance your living space with sustainable and beautiful pieces.
            </p>
          </div>
        </div>
      </section>
      
      <section className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg mt-8">
        <h2 className="text-3xl font-semibold text-teal-800 mb-4 text-center">Visit Our Shop</h2>
        <div className="flex flex-col items-center">
          <img src="/path/to/shop-image.jpg" alt="Our Shop" className="w-full max-w-lg h-auto rounded-lg shadow-md mb-4" />
          <p className="text-center text-gray-700">
            123 Furniture Lane, Suite 100<br />
            Woodsville, WO 12345<br />
            Phone: (123) 456-7890
          </p>
        </div>
      </section>

      <div className="text-center lg:col-span-2 flex justify-center items-center space-x-72 mt-20">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-green-400">
            <img className="w-full h-full object-cover" src="/landingimage/family.PNG" alt="family" />
          </div>
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-green-400">
            <img className="w-full h-full object-cover" src="landingimage/custom.PNG" alt="custom" />
          </div>
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-green-400">
            <img className="w-full h-full object-cover" src="landingimage/deliver.png" alt="deliver" />
          </div>
        </div>

        <div className="text-center lg:col-span-2 flex justify-center items-center space-x-10">
          <p>Craftsmanship at its Finest Our skilled artisans meticulously handcraft each piece of furniture to perfection.</p>
          <p>Custom Designs for your Space Create furniture that reflects your unique style and perfectly fits your space.</p>
          <p>Sustainable Materials We prioritize using eco-friendly materials that minimize our impact on the environment.</p>
        </div>
      
    </div>
  );
};

export default About;
