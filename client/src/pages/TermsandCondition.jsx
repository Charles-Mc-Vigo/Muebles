import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom"; 
import Footer from "../components/Footer";
import Header from "../components/Header";

const TermsAndConditions = () => {
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate(); 

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleBackToSignUp = () => {
    if (isChecked) {
      navigate("/signup"); 
    }
  };

  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto p-6 text-justify ">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <h2 className="text-2xl font-semibold mt-6">INTRODUCTION</h2>
        <p className="mb-4">
          1.1 Welcome to the Muebles platform (the "Site"). Please take a moment
          to read the following Terms of Service carefully before using the Site
          or creating a Muebles account ("Account") to understand your legal
          rights and obligations...
        </p>
        <h2 className="text-2xl font-semibold mt-6">PRIVACY AND DATA SECURITY</h2>
        <p className="mb-4">
          2.1 Muebles values your privacy and has provided the Muebles Privacy
          Policy to explain how we handle your information...
        </p>
        <h2 className="text-2xl font-semibold mt-6">ACCOUNT</h2>
        <p className="mb-4">
          3.1 Users can terminate their Account by notifying Muebles in writing...
        </p>
        <h2 className="text-2xl font-semibold mt-6">
          VIOLATION OF OUR TERMS OF SERVICE
        </h2>
        <p className="mb-4">
          4.1 Any misuse of the platform, including but not limited to the
          following, will be considered a violation of these Terms of Service...
        </p>
        <h2 className="text-2xl font-semibold mt-6">PURCHASE AND PAYMENT</h2>
        <p className="mb-4">
          5.1 Muebles supports the following payment methods...
        </p>
        <h2 className="text-2xl font-semibold mt-6">DELIVERY</h2>
        <p className="mb-4">
          6.1 We aim to process and dispatch all orders as swiftly as we can...
        </p>
        <h2 className="text-2xl font-semibold mt-6">
          CANCELLATION, NO RETURN AND NO REFUND
        </h2>
        <p className="mb-4">
          7.1 Once an order has been placed and payment has been processed, the
          buyer cannot cancel the order...
        </p>
        <h2 className="text-2xl font-semibold mt-6">FEEDBACK AND REVIEWS</h2>
        <p className="mb-4">
          8.1 Customers are encouraged to provide feedback and reviews regarding
          their experience with our products and services...
        </p>
        <h2 className="text-2xl font-semibold mt-6">WARRANTY AND LIABILITY</h2>
        <p className="mb-4">
          9.1 JCKAME Furniture provides a warranty for its products/services that
          covers defects in materials and workmanship under normal use...
        </p>
        <h2 className="text-2xl font-semibold mt-6">GENERAL PROVISIONS</h2>
        <p className="mb-4">
          10.1 Muebles may modify these Terms of Service at any time by posting
          the revised Terms of Service on this Site...
        </p>
        <p className="mt-6">
          I HAVE READ AND UNDERSTAND THESE TERMS AND CONDITIONS AND AGREE TO ALL
          OF THE PROVISIONS CONTAINED ABOVE AND ANY REVISIONS TO THE SAME
          HEREAFTER. BY CLICKING THE “SIGN UP” BUTTON DURING REGISTRATION, I
          ACKNOWLEDGE MY ACCEPTANCE OF THESE TERMS AND CONDITIONS AND CONSENT TO
          BE BOUND BY THEM IN THEIR ENTIRETY.
        </p>
        
        {/* Checkbox for terms acceptance */}
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="termsCheckbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="termsCheckbox" className="text-sm">
            I have read and understood the terms and conditions.
          </label>
        </div>

        {/* Back to Sign Up Arrow */}
        <div className="mt-4">
          <button
            onClick={handleBackToSignUp}
            disabled={!isChecked} 
            className={`flex items-center text-blue-500 hover:underline ${
              !isChecked ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <FaArrowLeft className="mr-2" />
            Back to Sign Up
          </button>
        </div>

        <p className="text-sm mt-6">Last updated: 08/10/2024</p>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;