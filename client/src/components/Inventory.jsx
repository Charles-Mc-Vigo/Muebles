import React, { useState, useEffect } from "react";
import axios from "axios";

const MaterialsTable = () => {
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ name: '', type: '', condition: '', quantity: '' });
  const [showForm, setShowForm] = useState(false);

  // Fetch materials
  const fetchMaterials = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/materials");
      console.log("Fetched materials:", response.data);
      setMaterials(response.data); 
    } catch (error) {
      console.error("Error fetching materials:", error);
      alert("Failed to fetch materials. Please try again.");
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial({ ...newMaterial, [name]: value });
  };

  const handleAddMaterial = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/materials", newMaterial);
      setMaterials([...materials, response.data]); 
      setNewMaterial({ name: '', type: '', condition: '', quantity: '' }); 
      setShowForm(false); 
    } catch (error) {
      console.error("Error adding material:", error);
      alert("Failed to add material. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Materials</h2>
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-white border-2 border-oliveGreen text-black font-bold py-2 px-4 rounded hover:bg-oliveGreen transition duration-300 mb-2"
        >
          {showForm ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {showForm && (
        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Wood Type"
            value={newMaterial.name}
            onChange={handleInputChange}
            className="border rounded p-2 mr-2"
          />
          <input
            type="text"
            name="type"
            placeholder="Wood Size"
            value={newMaterial.type}
            onChange={handleInputChange}
            className="border rounded p-2 mr-2"
          />
          <input
            type="text"
            name="condition"
            placeholder="Condition"
            value={newMaterial.condition}
            onChange={handleInputChange}
            className="border rounded p-2 mr-2"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={newMaterial.quantity}
            onChange={handleInputChange}
            className="border rounded p-2 mr-2"
          />
          <button
            onClick={handleAddMaterial}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Add Item
          </button>
        </div>
      )}

      <table className="min-w-full bg-white shadow-lg rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Woods Type</th>
            <th className="px-4 py-2 text-left">Woods Sizes</th>
            <th className="px-4 py-2 text-left">Condition</th>
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {materials.length > 0 ? (
            materials.map((material) => (
              <tr key={material.id} className="border-b">
                <td className="px-4 py-2">{material.name}</td>
                <td className="px-4 py-2">{material.type}</td>
                <td className="px-4 py-2">{material.condition}</td>
                <td className="px-4 py-2">{material.quantity}</td>
                <td className="px-4 py-2">
                 
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-center">
                No materials available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialsTable;
