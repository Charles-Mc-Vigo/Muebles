import React from 'react'

const Repair = () => {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          {/* Heading */}
          <h1 className="text-2xl font-semibold text-gray-700 mb-6">Reason of Repair</h1>
  
          {/* Radio Buttons */}
          <div className="mb-6">
            <label className="block text-gray-600 mb-2">Select the reason for repair:</label>
  
            {/* Damage Due to Delivery */}
            <div className="flex items-center mb-3">
              <input
                type="radio"
                id="damage-delivery"
                name="repairReason"
                value="damage_due_to_delivery"
                className="mr-2"
              />
              <label htmlFor="damage-delivery" className="text-gray-600">Damage Due to Delivery</label>
            </div>
  
            {/* Manufacturer Defects */}
            <div className="flex items-center mb-3">
              <input
                type="radio"
                id="manufacturer-defects"
                name="repairReason"
                value="manufacturer_defects"
                className="mr-2"
              />
              <label htmlFor="manufacturer-defects" className="text-gray-600">Manufacturer Defects</label>
            </div>
  
            {/* Defective Materials */}
            <div className="flex items-center mb-3">
              <input
                type="radio"
                id="defective-materials"
                name="repairReason"
                value="defective_materials"
                className="mr-2"
              />
              <label htmlFor="defective-materials" className="text-gray-600">Defective Materials</label>
            </div>
          </div>
  
          {/* Submit Button */}
          <button
            onClick={() => console.log('Repair request submitted')}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </div>
      </div>
    );
  };
  
  export default Repair;
  