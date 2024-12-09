import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

const FurnitureOrderForm = () => {
  const [formData, setFormData] = useState({
    admin: "",
    name: "",
    address: "",
    contact: "",
    orderDetails: "",
    paymentMethod: "",
    paymentType: "",
    downPayment: "",
    deliveryMethod: "",
    productPrice: 0,
    shippingFee: 0,
    totalAmount: 0,
    balance: 0,
    orderDate: "",
    referenceNo: "",
  });

  const [admins, setAdmins] = useState([]);
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // State to handle error messages

  // Fetch admins from the backend
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admin", {
          method: "GET",
          credentials: "include", // Ensure the admin token is sent with the request
        });

        if (!response.ok) {
          throw new Error("Failed to fetch admins");
        }

        const data = await response.json(); // Assuming the response contains an array of admins
        setAdmins(data); // Store the list of admins
      } catch (err) {
        setError(err.message); // Set error if any
      } finally {
        setLoading(false); // Set loading to false after the request
      }
    };

    fetchAdmins();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prevData) => ({ ...prevData, orderDate: today }));
  }, []);

  // Update totalAmount and balance when product price, shipping fee, down payment, or payment type changes
  useEffect(() => {
    const newShippingFee =
      formData.deliveryMethod === "deliver"
        ? parseFloat(formData.shippingFee)
        : 0;
    const newTotalAmount = parseFloat(formData.productPrice) + newShippingFee;
    const newBalance =
      formData.paymentType === "partial"
        ? Math.max(newTotalAmount - (parseFloat(formData.downPayment) || 0), 0)
        : 0;

    setFormData((prevData) => ({
      ...prevData,
      totalAmount: newTotalAmount,
      balance: newBalance,
    }));
  }, [
    formData.productPrice,
    formData.shippingFee,
    formData.deliveryMethod,
    formData.downPayment,
    formData.paymentType,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data being sent:", formData); // Log the form data before sending it

    // Validation for partial payment
    if (
      formData.paymentType === "partial" &&
      parseFloat(formData.downPayment) > formData.totalAmount
    ) {
      setError("Down payment cannot exceed the total amount.");
      return;
    } else {
      setError(""); // Clear any previous errors
    }

    try {
      // Log before sending the request to the backend
      console.log("Sending data to the backend...");

      // Send form data to your backend API using fetch
      const response = await fetch("http://localhost:3000/api/walk-in-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("Response Status:", response.status);
      console.log("Response Body:", await response.text());

      // Log response status
      console.log("Response Status:", response.status);

      if (response.ok) {
        const data = await response.json(); // Get the response data
        console.log("Order submitted successfully", data); // Log the success response
        alert("Order Submitted Successfully!");

        // Reset form data after submission
        setFormData({
          name: "",
          address: "",
          contact: "",
          orderDetails: "",
          paymentMethod: "",
          paymentType: "",
          downPayment: "",
          deliveryMethod: "",
          productPrice: 0,
          shippingFee: 0,
          totalAmount: 0,
          balance: 0,
          orderDate: new Date().toISOString().split("T")[0], // Reset to today's date
          referenceNo: "",
        });
      } else {
        // Log error if response is not okay
        console.log("Failed to submit the order. Response:", response);
        throw new Error("Failed to submit the order.");
      }
    } catch (error) {
      // Log the error if the fetch request fails
      console.error("Error submitting order", error);
      setError("Failed to submit the order.");
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg mt-5 mb-5 rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Walk-in Order Form
        </h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}{" "}
        {/* Display error message at the top */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="admin"
              className="block text-sm font-medium text-gray-700"
            >
              Admin:
            </label>
            {loading ? (
              <p>Loading admins...</p> // Show loading message
            ) : error ? (
              <p className="text-red-500">Error: {error}</p> // Show error message
            ) : (
              <select
                id="admin"
                name="admin"
                value={formData.admin}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select Admin
                </option>
                {admins.length > 0 ? (
                  admins.map((admin) => {
                    console.log(admin); // Log admin object structure
                    return (
                      <option key={admin._id} value={admin._id}>
                        {`${admin.firstname || ""} `}{" "}
                        {/* Fallback if names are undefined */}
                      </option>
                    );
                  })
                ) : (
                  <option disabled>No admins available</option> // Handle case when no admins are available
                )}
              </select>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              CustomerName:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address:
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Number:
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="orderDetails"
              className="block text-sm font-medium text-gray-700"
            >
              Order Details:
            </label>
            <textarea
              id="orderDetails"
              name="orderDetails"
              value={formData.orderDetails}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Product Price */}
          <div className="mb-4">
            <label
              htmlFor="productPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Product Price:
            </label>
            <input
              type="number"
              id="productPrice"
              name="productPrice"
              value={formData.productPrice}
              onChange={handleChange}
              required
              min="0"
              step="100"
              placeholder="Enter product price"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Payment Method */}
          <div className="mb-4">
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-medium text-gray-700"
            >
              Payment Method:
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>
                Select payment method
              </option>
              <option value="e-wallet">E-Wallet</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          {/* Reference Number (only for E-Wallet) */}
          {formData.paymentMethod === "e-wallet" && (
            <div className="mb-4">
              <label
                htmlFor="referenceNo"
                className="block text-sm font-medium text-gray-700"
              >
                Reference Number (for E-Wallet):
              </label>
              <input
                type="text"
                id="referenceNo"
                name="referenceNo"
                value={formData.referenceNo}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Payment Type */}
          <div className="mb-4">
            <label
              htmlFor="paymentType"
              className="block text-sm font-medium text-gray-700"
            >
              Payment Type:
            </label>
            <select
              id="paymentType"
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>
                Select payment type
              </option>
              <option value="full">Full Payment</option>
              <option value="partial">Partial Payment</option>
            </select>
          </div>

          {/* Down Payment Input */}
          {formData.paymentType === "partial" && (
            <div className="mb-4">
              <label
                htmlFor="downPayment"
                className="block text-sm font-medium text-gray-700"
              >
                Down Payment Amount:
              </label>
              <input
                type="number"
                id="downPayment"
                name="downPayment"
                value={formData.downPayment}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Delivery Method */}
          <div className="mb-4">
            <label
              htmlFor="deliveryMethod"
              className="block text-sm font-medium text-gray-700"
            >
              Delivery Method:
            </label>
            <select
              id="deliveryMethod"
              name="deliveryMethod"
              value={formData.deliveryMethod}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>
                Select delivery method
              </option>
              <option value="pickup">Pickup</option>
              <option value="deliver">Deliver</option>
            </select>
          </div>

          {/* Shipping Fee */}
          {formData.deliveryMethod === "deliver" && (
            <div className="mb-4">
              <label
                htmlFor="shippingFee"
                className="block text-sm font-medium text-gray-700"
              >
                Shipping Fee:
              </label>
              <input
                type="number"
                id="shippingFee"
                name="shippingFee"
                value={formData.shippingFee}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter shipping fee"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Total Amount */}
          <div className="mb-4">
            <label className="block text-xl font-medium text-gray-700">
              Total Amount:
            </label>
            <p className="mt-1 text-xl">₱{formData.totalAmount}</p>
          </div>

          {/* Balance Due */}
          <div className="mb-4">
            <label className="block text-xl text-gray-700">Balance Due:</label>
            <p className="mt-1 text-xl font-semibold">
              ₱{formData.balance.toFixed(2)}
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-600 text-black text-xl rounded-md font-semibold hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit Order
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default FurnitureOrderForm;
