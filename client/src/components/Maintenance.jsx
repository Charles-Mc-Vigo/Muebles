import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Maintenance = () => {
    const initialSizeState = {
        label: "",
        height: "",
        length: "",
        width: "",
        depth: "",
        furnitureTypeId: "",
    };
    const initialColorState = {
        name: "",
        rgb: "",
        hex: "",
    };

    const [categories, setCategories] = useState([]);
    const [furnitureTypes, setFurnitureTypes] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("");
    const [selectedFurnitureType, setSelectedFurnitureType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [newItemName, setNewItemName] = useState("");
    const [newSize, setNewSize] = useState(initialSizeState);
    const [newColor, setNewColor] = useState(initialColorState);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setNewSize((prevSize) => ({ ...prevSize, [id]: value }));
    };

    const handleColorChange = (e) => {
        const { name, value } = e.target;
        setNewColor((prevColor) => ({ ...prevColor, [name]: value }));
    };

    const handleAddNewItem = () => {
        if (!newItemName && selectedFilter !== "Furniture Size" && selectedFilter !== "Colors") {
            toast.error("Please enter a valid name.");
            return;
        }
        toast.success(`${selectedFilter} added successfully.`);
        resetInputFields();
    };

    const resetInputFields = () => {
        setNewItemName("");
        setNewColor(initialColorState);
        setNewSize(initialSizeState);
    };

    const renderInputField = (label, name, value, onChange, type = "text", placeholder) => (
        <div className="mb-5 w-1/2" key={name}>
            <label className="block mb-1">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border-2 p-3 rounded-xl border-oliveGreen"
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <div className="flex flex-col items-center py-10">
            <h1 className="font-bold text-5xl mb-5">JCKAME Maintenance</h1>
            <div className="container w-3/4 mx-auto p-4 bg-gray-100 shadow-lg rounded-lg border-2 border-oliveGreen mb-10">
                <h2 className="text-xl font-bold mb-5">Add New Item</h2>
                <div className="mb-5 w-1/4">
                    <label className="block mb-1">Select Type</label>
                    <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        className="w-full border-2 p-3 rounded-xl border-oliveGreen"
                    >
                        <option value="" disabled>
                            Select Type
                        </option>
                        <option value="Categories">Categories</option>
                        <option value="Furniture Types">Furniture Types</option>
                        <option value="Colors">Furniture Colors</option>
                        <option value="Furniture Size">Furniture Size</option>
                    </select>
                </div>
                {selectedFilter === "Colors" && (
                    <>
                        {renderInputField("Color Name", "name", newColor.name, handleColorChange)}
                        {renderInputField("RGB Value", "rgb", newColor.rgb, handleColorChange)}
                        {renderInputField("Hex Value", "hex", newColor.hex, handleColorChange)}
                    </>
                )}
                {(selectedFilter !== "Furniture Size" && selectedFilter !== "Furniture Types" && selectedFilter !== "Colors") &&
                    renderInputField("Item Name", "itemName", newItemName, (e) => setNewItemName(e.target.value))}
                {selectedFilter === "Furniture Size" && (
                    <div className="flex space-x-5 mb-2 w-full">
                        <div className="flex-1 mb-4">
                            <label className="block mb-1">Select Furniture Type</label>
                            <select
                                name="filterFurnitureTypes"
                                onChange={(e) => setSelectedFurnitureType(e.target.value)}
                                value={selectedFurnitureType}
                                className="border-2 p-3 rounded-xl border-oliveGreen w-full"
                            >
                                <option value="">Select Furniture Types</option>
                                {furnitureTypes.map((furnitureType) => (
                                    <option key={furnitureType._id} value={furnitureType.name}>
                                        {furnitureType.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {renderInputField("Item Name", "label", newSize.label, handleChange)}
                        {["width", "length", "height", "depth"].map((dim) =>
                            renderInputField(
                                dim.charAt(0).toUpperCase() + dim.slice(1) + " (cm)",
                                dim,
                                newSize[dim],
                                handleChange,
                                "number",
                                `Enter ${dim}`
                            )
                        )}
                    </div>
                )}
                {selectedFilter === "Furniture Types" && (
                    <div className="flex mb-5">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                className="w-full border-2 p-3 rounded-xl border-oliveGreen"
                                placeholder="Enter furniture type name"
                            />
                        </div>
                        <div className="ml-4 flex-1">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full border-2 p-3 rounded-xl border-oliveGreen"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
                <div className="mb-5">
                    <button
                        onClick={handleAddNewItem}
                        className="bg-oliveGreen text-white px-4 py-2 rounded-lg"
                    >
                        Add New Item
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Maintenance;