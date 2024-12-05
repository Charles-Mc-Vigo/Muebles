import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Repair = () => {
  const { orderId } = useParams();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason) {
      alert("Please select a reason for repair");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/api/orders/request-for-repair/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            reason: reason,
          })
        }
      );

      

      if (!response.ok) {
        throw new Error("Could not submit repair request");
      }

      const responseData = await response.json();
      toast.success("Repair request submitted successfully!");
      setTimeout(()=>{
        navigate(-1)
      },2000)
      console.log("Response:", responseData);
    } catch (error) {
      console.error("Error submitting repair request:", error);
      setError("Failed to submit repair request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">
          Reason for Repair
        </h1>

        {/* Loading/Error Messages */}
        {loading && <p className="text-blue-500">Submitting your request...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Radio Buttons */}
        <div className="mb-6">
          <label className="block text-gray-600 mb-2">
            Select the reason for repair:
          </label>

          {/* Damage Due to Delivery */}
          <div className="flex items-center mb-3">
            <input
              type="radio"
              id="damage-delivery"
              name="repairReason"
              value="damage_due_to_delivery"
              className="mr-2"
              onChange={(e) => setReason(e.target.value)}
            />
            <label htmlFor="damage-delivery" className="text-gray-600">
              Damage Due to Delivery
            </label>
          </div>

          {/* Manufacturer Defects */}
          <div className="flex items-center mb-3">
            <input
              type="radio"
              id="manufacturer-defects"
              name="repairReason"
              value="manufacturer_defects"
              className="mr-2"
              onChange={(e) => setReason(e.target.value)}
            />
            <label htmlFor="manufacturer-defects" className="text-gray-600">
              Manufacturer Defects
            </label>
          </div>

          {/* Defective Materials */}
          <div className="flex items-center mb-3">
            <input
              type="radio"
              id="defective-materials"
              name="repairReason"
              value="defective_materials"
              className="mr-2"
              onChange={(e) => setReason(e.target.value)}
            />
            <label htmlFor="defective-materials" className="text-gray-600">
              Defective Materials
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Repair;
