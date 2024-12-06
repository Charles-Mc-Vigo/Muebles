import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

const FurnitureOrderForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    orderDetails: "",
    paymentMethod: "",
    paymentType: "", // Payment type (Partial or Full)
    downPayment: "", // Down payment amount
    deliveryMethod: "",
    totalAmount: 1000, // Example total amount
    balance: 1000, // Balance starts as total amount
    orderDate: "", // Order date
  });

  const [error, setError] = useState(""); // State to handle error messages

  useEffect(() => {
    // Update balance when payment type or down payment changes
    if (formData.paymentType === "partial") {
      const newBalance = formData.totalAmount - formData.downPayment;
      setFormData((prevData) => ({
        ...prevData,
        balance: newBalance >= 0 ? newBalance : 0, // Ensure no negative balance
      }));
    } else {
      // For full payment, balance is 0
      setFormData((prevData) => ({
        ...prevData,
        balance: 0,
      }));
    }
  }, [formData.downPayment, formData.paymentType, formData.totalAmount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation for partial payment
    if (formData.paymentType === "partial" && formData.downPayment > formData.totalAmount) {
      setError("Down payment cannot exceed the total amount.");
      return;
    } else {
      setError(""); // Clear any previous errors
    }

    console.log("Form Submitted", formData);
    // Add further logic to submit form data (e.g., sending to an API)
  };

  return (
    <div className="">
      <Header />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg mt-5 mb-5 rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Walk-in Order Form
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name:
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

          {/* Show Down Payment Input only if Partial Payment is selected */}
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

          {/* Show error message if down payment is invalid */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

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

          {/* Order Date Field */}
          <div className="mb-4">
            <label
              htmlFor="orderDate"
              className="block text-sm font-medium text-gray-700"
            >
              Order Date:
            </label>
            <input
              type="date"
              id="orderDate"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xl font-medium text-gray-700">
              Total Amount:
            </label>
            <p className="mt-1 text-xl">₱{formData.totalAmount}</p>
          </div>

          <div className="mb-4">
            <label className="block text-xl text-gray-700">
              Balance Due:
            </label>
            <p className="mt-1 text-xl font-semibold">
              ₱{formData.balance.toFixed(2)}
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
