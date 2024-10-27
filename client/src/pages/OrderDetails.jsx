// OrderDetails.jsx
import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const OrderDetails = () => {
	const [proofOfPayment, setProofOfPayment] = useState(null);
	const [uploadMessage, setUploadMessage] = useState("");

  const navigate = useNavigate();

	// Dummy data for order details
	const order = {
		id: "12345",
		date: "2023-10-10",
		items: [
			{
				name: "Wooden Chair",
				price: 1200,
				quantity: 2,
			},
			{
				name: "Glass Coffee Table",
				price: 3500,
				quantity: 1,
			},
		],
		totalAmount: 5900,
		paymentMethod: "GCash",
		status: "Pending",
	};

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		setProofOfPayment(file);
		setUploadMessage(`Selected file: ${file.name}`);
	};

	const handleProofSubmission = () => {
		if (proofOfPayment) {
			alert("Proof of payment uploaded successfully!");
			setUploadMessage("Proof of payment uploaded successfully!");
		} else {
			alert("Please select a file before submitting.");
		}
	};

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-md mt-10">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-2)} // Navigate to the previous page
          className="text-gray-500"
        >
          <IoMdArrowRoundBack size={30} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800 text-center flex-grow">
          Order Details
        </h1>
      </div>
  
      {/* Order Summary Section */}
      <div className="border-b pb-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Order Summary</h2>
        <div className="grid grid-cols-2 gap-4 text-lg text-gray-600">
          <div>
            <p>
              <span className="font-semibold">Order ID:</span> {order.id}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {order.date}
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Payment Method:</span> {order.paymentMethod}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`${
                  order.status === "Pending" ? "text-yellow-600" : "text-green-600"
                } font-semibold`}
              >
                {order.status}
              </span>
            </p>
          </div>
        </div>
      </div>
  
      {/* Order Items Section */}
      <div className="border-b pb-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Items</h2>
        <ul>
          {order.items.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center py-4 border-b border-gray-200"
            >
              <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-gray-600">
                  Quantity: {item.quantity} x ₱{item.price.toFixed(2)}
                </p>
              </div>
              <p className="text-lg font-medium text-gray-800">
                ₱{(item.price * item.quantity).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-right text-xl font-semibold mt-4">
          Total: ₱{order.totalAmount.toFixed(2)}
        </p>
      </div>
  
      {/* Proof of Payment Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upload Proof of Payment</h2>
        <div className="flex flex-col items-center">
          <input
            type="file"
            onChange={handleFileUpload}
            className="mb-4 w-full max-w-md border border-gray-300 rounded-md px-3 py-2 text-gray-600"
          />
          <button
            onClick={handleProofSubmission}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Submit Proof of Payment
          </button>
          {uploadMessage && <p className="mt-4 text-gray-600">{uploadMessage}</p>}
        </div>
      </div>
    </div>
  );
  
};

export default OrderDetails;
