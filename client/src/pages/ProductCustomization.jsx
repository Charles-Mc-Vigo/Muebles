import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Model } from "../Models/ChairModels";

const ProductCustomization = () => {
  // State variables for customization selections
  const [selectedBackrest, setSelectedBackrest] = useState(0);
  const [selectedSeat, setSelectedSeat] = useState(0);

  // Handlers for each part selection
  const handleBackrestChange = (designIndex) => {
    setSelectedBackrest(designIndex);
  };

  const handleSeatChange = (designIndex) => {
    setSelectedSeat(designIndex);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Canvas for the 3D model */}
      <div className="flex-grow bg-slate-200">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} />
          <Model 
            selectedBackrest={selectedBackrest}
            selectedSeat={selectedSeat}
          />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* Customization Controls */}
      <div className="flex flex-col md:flex-row">
        {/* Backrest customization controls */}
        <div className="flex-1 bg-blue-200 p-4">
          <h3 className="text-lg font-semibold">Backrest Options</h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleBackrestChange(0)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Default
            </button>
            {[1, 2, 3, 4].map((index) => (
              <button
                key={`backrest-${index}`}
                onClick={() => handleBackrestChange(index)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Design {index}
              </button>
            ))}
          </div>
        </div>

        {/* Seat customization controls */}
        <div className="flex-1 bg-orange-200 p-4">
          <h3 className="text-lg font-semibold">Seat Options</h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleSeatChange(0)} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              Default
            </button>
            {[1, 2, 3, 4].map((index) => (
              <button
                key={`seat-${index}`}
                onClick={() => handleSeatChange(index)}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Design {index}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomization;