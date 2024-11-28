import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Delivery = () => {
  return (
    <div
      className="min-h-screen flex flex-col "
      style={{ fontFamily: "Playfair Display, serif" }}
    >
      <Header isLogin={true} cartCount={true} />
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto bg-gray-300 rounded-lg shadow-lg p-12 my-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left side - Delivery Information */}
            <div className="space-y-3 text-justify">
              <h1
                className="text-3xl font-bold mb-5 text-center"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Shipping Information
              </h1>

              <p className="mb-10 font-semibold text-xl">
                Delivery and Shipping service will be provided by our partners.
              </p>
              <p className="mb-4">
                Aiming to provide our customers with a comfortable online
                shopping experience, we take extra care and precaution to ensure
                that your parcel is shipped out in good condition and is handled
                accordingly by our delivery partners.
              </p>
              <p className="mb-2">
                At Muebles, we handle all deliveries in-house to ensure the
                highest quality service and care. We are dedicated to providing
                a seamless and efficient shopping experience. By managing our
                own delivery operations, we can ensure that your orders are
                handled with utmost care and delivered directly to your doorstep
                in perfect condition. All orders are processed within 1 week,
                prepared for delivery by our in-house team. Once your order is
                ready, our team will contact you directly to schedule the
                delivery at your convenience.
              </p>


              <p className=" mb-4">
                **Please check on the Delivery Method before proceeding with
                your online purchase.
              </p>

              <h4 className="font-semibold mb-2 text-2xl">
                Mode of Delivery: Pick Up & Delivery
              </h4>
              <h5 className="text-xl font-semibold ">Delivery Option</h5>
              <p className="text-base text-justify">
                We provide a one-time delivery attempt to your specified
                address. Please ensure someone is available to receive the
                delivery at the scheduled time, as there will be no additional
                attempts if the delivery is missed. Ensure that the delivery
                location is accessible. Clear paths should be provided to
                facilitate smooth delivery.
              </p>
              <h3 className="text-xl font-semibold ">Pick-Up Option</h3>
              <p className="text-base text-justify">
                If you prefer, you can choose to pick up your order directly
                from our store location. This option allows you to collect your
                purchase at a convenient time within the specified pick-up
                period.
              </p>
            </div>

            {/* Right side - Coverage Area Table */}
            <div className="space-y-6 bg-slate-100 p-6 rounded-lg text-justify">
              <h2 className="text-xl font-bold mb-4">Area of Coverage</h2>
              <p className="mb-4">
                Décor & home fashion products can be shipped throughout
                Marinduque. The delivery charges are as follows:
              </p>

              {/* Delivery Table */}
              <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
                <table className="min-w-full table-auto bg-white text-left">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="px-4 py-2 border">Town</th>
                      <th className="px-4 py-2 border">Zipcode</th>
                      <th className="px-4 py-2 border">Shipping Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border">Boac</td>
                      <td className="px-4 py-2 border">4900</td>
                      <td className="px-4 py-2 border">₱100</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border">Mogpog</td>
                      <td className="px-4 py-2 border">4901</td>
                      <td className="px-4 py-2 border">₱150</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border">Gasan</td>
                      <td className="px-4 py-2 border">4905</td>
                      <td className="px-4 py-2 border">₱150</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border">Buenavista</td>
                      <td className="px-4 py-2 border">4904</td>
                      <td className="px-4 py-2 border">₱200</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border">Torrijos</td>
                      <td className="px-4 py-2 border">4903</td>
                      <td className="px-4 py-2 border">₱250</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border">Sta. Cruz</td>
                      <td className="px-4 py-2 border">4902</td>
                      <td className="px-4 py-2 border">₱200</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-xl font-semibold mb-4">
                Delivery Policy
              </h2>
              <p className="text-base text-justify">
                Each order will have one delivery attempt to the designated address. Customers will receive a notification confirming the delivery date and time window as a reminder. Please ensure someone is available to receive the products. If delivery is missed, it will not be rescheduled. Delivery fees are non-refundable, and customers must pick up the item if delivery fails. For questions or assistance, contact Muebles customer support.
              </p>

              <p className="mb-4 font-semibold ">
                At present, JCKAME offers services exclusively in the following
                areas.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Delivery;
