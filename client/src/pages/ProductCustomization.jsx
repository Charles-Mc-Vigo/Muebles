import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Chair } from "../Models/ChairModels";
import { Door } from "../Models/DoorModels";

const ProductCustomization = () => {
  // State for selected model
  const [selectedModel, setSelectedModel] = useState("chair");
  // for chair
  const [selectedBackrest, setSelectedBackrest] = useState(0);
  const [selectedSeat, setSelectedSeat] = useState(0);
  // for door
  const [selectedDesign, setSelectedDesign] = useState(1);

  // Handlers for each part selection
  const handleBackrestChange = (e) => {
    if (selectedModel === "chair") setSelectedBackrest(Number(e.target.value));
  };
  const handleSeatChange = (e) => {
    if (selectedModel === "chair") setSelectedSeat(Number(e.target.value));
  };
  const handleDoorDesignChange = (e) => {
    if (selectedModel === "door") setSelectedDesign(Number(e.target.value));
  };

  return (
    <div className="flex flex-col h-screen">
      <Header isLogin={true} />
      <div className="flex-grow flex flex-col md:flex-row bg-gray-100 p-4">
        {/* Canvas for the 3D model */}
        <div className="flex-grow md:w-2/3 flex items-center justify-center">
          <Canvas>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} />
            {/* Conditionally render models */}
            {selectedModel === "chair" && (
              <Chair selectedBackrest={selectedBackrest} selectedSeat={selectedSeat} />
            )}
            {selectedModel === "door" && <Door selectedDesign={selectedDesign} />}
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>
        {/* Customization Controls */}
        <div className="md:w-1/3 flex flex-col space-y-4 p-4">
          {/* Model Selection Dropdown */}
          <div className="flex justify-center mb-4">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-4 py-2 border rounded shadow"
            >
              <option value="chair">Chair</option>
              <option value="door">Door</option>
            </select>
          </div>
          {/* Chair Customization Controls */}
          {selectedModel === "chair" && (
            <>
              <div className="bg-white shadow rounded p-4">
                <h3 className="text-lg font-semibold">Backrest Options</h3>
                <select
                  value={selectedBackrest}
                  onChange={handleBackrestChange}
                  className="mt-2 px-4 py-2 border rounded shadow w-full"
                >
                  <option value={0}>Default</option>
                  {[1, 2, 3, 4].map((index) => (
                    <option key={`backrest-${index}`} value={index}>
                      Design {index}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-white shadow rounded p-4">
                <h3 className="text-lg font-semibold">Seat Options</h3>
                <select
                  value={selectedSeat}
                  onChange={handleSeatChange}
                  className="mt-2 px-4 py-2 border rounded shadow w-full"
                >
                  <option value={0}>Default</option>
                  {[1, 2, 3, 4].map((index) => (
                    <option key={`seat-${index}`} value={index}>
                      Design {index}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          {/* Door Customization Controls */}
          {selectedModel === "door" && (
            <div className="bg-white shadow rounded p-4">
              <h3 className="text-lg font-semibold">Door Designs</h3>
              <select
                value={selectedDesign}
                onChange={handleDoorDesignChange}
                className="mt-2 px-4 py-2 border rounded shadow w-full"
              >
                <option value={0}>Default</option>
                {[1, 2, 3, 4, 5, 6, 7].map((index) => (
                  <option key={`door-${index}`} value={index}>
                    Design {index}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductCustomization;