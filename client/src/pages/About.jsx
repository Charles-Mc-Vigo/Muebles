import React, { useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const About = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <div className="About-page">
      <Header />
      <section className="flex flex-col items-center p-5 bg- ">
        <div className="w-full max-w-4xl p-10 rounded-xl">
          <h1 className="text-4xl font-bold font-serif ">The JCKAME Story</h1>
          <div className="w-2/5 h-1 bg-green-500 mb-6"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <img
              src="/landingimage/LOGO.jpg"
              alt="JC Kame Logo"
              className="w-full md:w-1/2 lg:w-1/3 p-1 object-contain  rounded-md "
            />
            <div className="text-black text-xl sm:text-lg text-justify">
              <p>
                Established in 2003, JC Kame Wood Furniture Shop has been a
                trusted name in crafting high-quality, custom wood furniture in
                Cawit, Boac, Marinduque, with over five decades of experience.
              </p>
              <p className="mt-4">
                We specialize in creating durable and elegant furniture that
                reflects the beauty of natural wood. Our commitment to
                craftsmanship and customer satisfaction has made us a go-to
                destination for homeowners and businesses alike. Whether you're
                looking for timeless classics or modern designs, JC Kame Wood
                Furniture Shop ensures every piece is made with care and
                precision to enhance the comfort and style of your space.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="justify-evenly flex w-full  h-1/2 bg-green-500 mb-5">
        <h1 className="text-3xl font-bold text-white border-r-2 p-2 border-white my-4 ">
          100+
          <p className="text-xl font-normal">Customer Satisfied</p>
        </h1>
        <h1 className="text-3xl font-bold text-white border-r-2 p-2 border-white my-4">
          80%
          <p className="text-xl font-normal text-white">Ratings of our Services</p>
        </h1>
        <h1 className="text-3xl font-bold border-r-2 p-2 text-white border-white my-4 ">
          70%
          <p className="text-xl font-normal text-white">Customer Retention Success</p>
        </h1>
      </div>
      {/* core values */}
      <section className="flex flex-col items-center justify-center ">
        <div className="flex flex-col text-center  items-center max-w-4xl mb-5">
          <h1 className="text-3xl font-bold mb-2">Our Core Values</h1>
          <p className="text-lg text-black">
            We take pride in embodying values that guide every aspect of our
            work. From maintaining honesty and trust to ensuring unparalleled
            craftsmanship, we strive to deliver furniture that enriches your
            living spaces. Rooted in passion, transparency, and dedication to
            excellence, we aim to forge lasting connections with our customers
            while creating timeless pieces that reflect our unwavering
            commitment to quality and integrity.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 p-2 gap-5 bg-green-500 w-full ">
          <div className="flex flex-col items-center text-center bg-white p-4 rounded-lg shadow-md hover:scale-90 transition-transform duration-300 ">
            <img
              src="/Advertisement/aboutsicon/Integrity.png"
              alt="Integrity"
              className="h-24 sm:h-32 "
            />
            <h4 className="font-bold text-xl sm:text-2xl">Integrity</h4>
            <p className="text-black text-base sm:text-lg">
              We operate with honesty and transparency in all aspects of our
              business practices.
            </p>
          </div>

          <div className="flex flex-col items-center text-center bg-white p-2 rounded-lg shadow-md hover:scale-90 transition-transform duration-300">
            <img
              src="/Advertisement/aboutsicon/Quality.png"
              alt="Quality"
              className="h-24 sm:h-32 "
            />
            <h4 className="font-bold text-xl sm:text-2xl">Quality</h4>
            <p className="text-black text-base sm:text-lg">
              We are dedicated to creating exceptional, well-crafted furniture
              that stands the test of time.
            </p>
          </div>

          <div className="flex flex-col items-center text-center bg-white  rounded-lg shadow-md hover:scale-90 transition-transform duration-300">
            <img
              src="/Advertisement/aboutsicon/Trust.png"
              alt="Trust"
              className="h-24 sm:h-32 "
            />
            <h4 className="font-bold text-xl sm:text-2xl">Trust</h4>
            <p className="text-black text-base sm:text-lg">
              Trust is the foundation of our business. We strive to earn your
              trust with every piece we make.
            </p>
          </div>

          <div className="flex flex-col items-center text-center bg-white  rounded-lg shadow-md hover:scale-90 transition-transform duration-300">
            <img
              src="/Advertisement/aboutsicon/Passion.png"
              alt="Passion"
              className="h-24 sm:h-32 "
            />
            <h4 className="font-bold text-xl sm:text-2xl">Passion</h4>
            <p className="text-black text-base sm:text-lg">
              We are passionate about turning raw materials into lasting
              furniture that enhances the beauty of your home.
            </p>
          </div>

          <div className="flex flex-col items-center text-center bg-white  rounded-lg shadow-md hover:scale-90 transition-transform duration-300">
            <img
              src="/Advertisement/aboutsicon/Craftmanship.png"
              alt="Craftsmanship"
              className="h-24 sm:h-32 "
            />
            <h4 className="font-bold text-xl sm:text-2xl">Craftsmanship</h4>
            <p className="text-black text-base sm:text-lg">
              Each piece is crafted with precision and care, combining
              traditional methods with modern design.
            </p>
          </div>
          <div className="flex flex-col items-center text-center bg-white rounded-lg shadow-md hover:scale-90 transition-transform duration-300">
            <img
              src="/Advertisement/aboutsicon/Security.png"
              alt="Security"
              className="h-24 sm:h-32 "
            />
            <h4 className="font-bold text-xl sm:text-2xl">Security</h4>
            <p className="text-black text-base sm:text-lg mt-1">
              We value the security of our transactions and ensure our customers
              feel safe doing business with us.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center p-5 bg-white ">
        <div className="w-full max-w-4xl p-10 rounded-xl">
          <h1 className="text-4xl font-bold font-serif">Our Commitment</h1>
          <div className="h-1 w-2/5 bg-green-500 mb-6"></div>
          <div className="flex flex-col md:flex-row-reverse">
            <Slider {...settings} className="w-full md:w-2/5">
              <div>
                <img
                  src="/Advertisement/carouselimages/livingroom.png"
                  alt="Affordable"
                  className="w-full h-64 sm:h-80 md:h-96 object-cover p-1 rounded-xl"
                />
              </div>
              <div>
                <img
                  src="/Advertisement/carouselimages/diningroom.png"
                  alt="Durable"
                  className="w-full h-64 sm:h-80 md:h-96 object-cover p-1 rounded-xl"
                />
              </div>
              <div>
                <img
                  src="/Advertisement/carouselimages/image2.jpg"
                  alt="Reliable"
                  className="w-full h-64 sm:h-80 md:h-96 object-cover p-1 rounded-xl"
                />
              </div>
              <div>
                <img
                  src="/Advertisement/carouselimages/image1.jpg"
                  alt="Reliable"
                  className="w-full h-64 sm:h-80 md:h-96 object-cover p-1 rounded-xl"
                />
              </div>
            </Slider>
            <div className="text-black text-xl sm:text-lg text-justify md:w-3/5 p-4">
              <p>
                At JCKAME, we are passionate about crafting wooden furniture
                that combines beauty, durability, and functionality. Each piece
                is carefully designed by skilled artisans using high-quality
                materials to ensure it stands the test of time. We believe that
                great furniture should be accessible, offering exceptional value
                without compromising on craftsmanship. Our commitment to quality
                and design is matched by our dedication to providing a seamless
                customer experience. At JCKAME, we aim to earn your trust by
                delivering furniture that not only meets but exceeds your
                expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="flex h-screen  items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/Advertisement/carouselimages/JCAKME.png')",
        }}
      >
        <Link to="/home">
        <button className="px-6  py-3 bg-transparent border-white border mt-20 text-white font-bold text-lg rounded-lg shadow-md hover:bg-green-600 transition-all">
          Shop Now
        </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default About;
