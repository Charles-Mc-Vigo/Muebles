import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Delivery = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-12 my-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left side - Delivery Information */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold mb-10 text-center">
                Shipping Information
              </h1>

              <p className="mb-4">
                Delivery and Shipping service will be provided by our partners.
              </p>
              <p className="mb-4">
                Aiming to provide our customers with a comfortable online
                shopping experience, we take extra care and precaution to ensure
                that your parcel is shipped out in good condition and is handled
                accordingly by our delivery partners.
              </p>
              <p className="mb-2">
                At Muebles, we handle all deliveries in-house to ensure the highest
                quality service and care. We are dedicated to providing a seamless
                and efficient shopping experience. By managing our own delivery
                operations, we can ensure that your orders are handled with utmost
                care and delivered directly to your doorstep in perfect condition.
                All orders are processed within 1 week, prepared for delivery by
                our in-house team. Once your order is ready, our team will contact
                you directly to schedule the delivery at your convenience.
              </p>

              <p className="font-bold mb-4">
                **Please check on the Delivery Method before proceeding with your
                online purchase.
              </p>

              <h4 className="text-lg font-bold mb-4">Pick Up Method</h4>
              <h3 className="text-lg font-bold mb-4">Drop Off Delivery Method</h3>
            </div>

            {/* Right side - Coverage Area Table */}
            <div className="space-y-6 bg-slate-100 p-6 rounded-lg">
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

              <h2 className="text-xl font-semibold mb-4">Cancellation of Furniture Delivery</h2>
              <p>
                Order deliveries can be canceled with at least three days' notice. To
                request a cancellation and to reschedule your delivery date and time,
                please contact us through our system or send us an email. Your request
                will be processed accordingly.
              </p>

              <p className="mb-4 font-semibold">
                At present, JCKAME offers services exclusively in the following areas.
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
