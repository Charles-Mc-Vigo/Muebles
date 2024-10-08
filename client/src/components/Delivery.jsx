import React from "react";
import Header from "./Header"; 
import Footer from "./Footer"; 

const Delivery = () => {
  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-8 text-justify">
        <h1 className="text-3xl font-bold mb-10 text-center">Shipping Information</h1>

        <p className="mb-4">
          Delivery and Shipping service will be provided from our partners.
        </p>
        <p className="mb-4">
          Aiming to provide our customers with a comfortable online shopping experience, we take extra care and precaution to ensure that your parcel is shipped out in good condition and is handled accordingly by our delivery partners.
        </p>
        <p className="mb-4">
          All orders will be processed in 72 hours and to be handed over to our delivery partners and they will contact you soon. This is to schedule your delivery as well as inform you about payment for delivery charge.
        </p>
        <p className="font-bold mb-4">
          **Please check on the Delivery Method before proceeding with online purchase.
        </p>

        <h2 className="text-xl font-bold mb-4">Area of Coverage</h2>

        <h3 className="text-lg font-bold mb-4">Drop off Delivery Method</h3>

        <p className="mb-4">
          Décor & home fashion products can be shipped throughout the Philippines (82 Regions). The delivery charges are as below:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Metro Manila PHP200.00</li>
          <li>Other 81 Regions PHP400.00</li>
        </ul>

        <h3 className="text-lg font-bold text-red-600 mb-4">
          OUT OF ZONE (NON-SHIPPING AREA)
        </h3>
        <p className="mb-4 text-red-600">
          #Click here for more details OUT OF ZONE
        </p>

        <p className="mb-4">
          Our courier service some specific areas  these regions are not covered by our standard courier services.
        </p>

        {/* Table for Out of Zone */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="min-w-full table-auto bg-white text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">OUT OF ZONE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4">
                  <strong>Luzon</strong> <br />
                  <span className="text-sm">Postcode:</span> <br />
                  3506, 3520, 4339, 4600, 4603, 4602, 5100, etc.
                </td>
              </tr>
              <tr>
                <td className="p-4">
                  <strong>Visayas</strong> <br />
                  <span className="text-sm">Postcode:</span> <br />
                  6050, 6812, 6802, 6412, etc.
                </td>
              </tr>
              <tr>
                <td className="p-4">
                  <strong>Remote</strong> <br />
                  *Refer to #Click here for more details OUT OF ZONE
                </td>
              </tr>
              <tr>
                <td className="p-4">
                  <strong>Mindanao</strong> <br />
                  *Refer to #Click here for more details OUT OF ZONE
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Delivery;
