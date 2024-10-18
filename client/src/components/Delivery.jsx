import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Delivery = () => {
  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-8 text-justify">
        <h1 className="text-3xl font-bold mb-10 text-center">
          Shipping Information
        </h1>

        <p className="mb-4">
          Delivery and Shipping service will be provided from our partners.
        </p>
        <p className="mb-4">
          Aiming to provide our customers with a comfortable online shopping
          experience, we take extra care and precaution to ensure that your
          parcel is shipped out in good condition and is handled accordingly by
          our delivery partners.
        </p>
        <p className="mb-2">
          At Muebles, we handle all deliveries in-house to ensure the highest
          quality service and care. We are dedicated to providing a seamless and
          efficient shopping experience. By managing our own delivery
          operations, we can ensure that your orders are handled with outmost
          care and delivery directly to your doorstep in perfect condition. All
          orders are processes within 1week prepared for delivery by our in
          house team. Once your order is ready, our team will contact you
          directly to schedule the delivery at your convenience.This is to
          arrange your delivery and provide details regarding the payment for
          the delivery fee. By managing the entire delivery process, Muebles
          guarantees a smooth, reliable, and timely shipping experience for
          every order.
        </p>

        <p className="font-bold mb-4">
          **Please check on the Delivery Method before proceeding with online
          purchase.
        </p>

        <h2 className="text-xl font-bold mb-4">Area of Coverage</h2>

        <h3 className="text-lg font-bold mb-4">Drop off Delivery Method</h3>

        <p className="mb-4">
          Décor & home fashion products can be shipped throughout Marinduque.
          The delivery charges are as below:
        </p>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="min-w-full table-auto bg-white text-left">
            <thead className="bg-gray-100">
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

        <p className="text-xl font-semibold space-x-5">Cancellation of Furniture Delivery</p>
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
      <Footer />
    </div>
  );
};

export default Delivery;
