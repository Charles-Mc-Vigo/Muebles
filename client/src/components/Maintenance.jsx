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
        <div className="mb-4" key={name}>
            <label className="block mb-1 font-semibold">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border rounded p-2"
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">
                JCKAME Maintenance
            </h1>
            <div className="flex flex-row justify-center">
                <form onSubmit={(e) => { e.preventDefault(); handleAddNewItem(); }} className="mb-6 space-y-4 w-1/2">
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Select Type</label>
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="w-full border rounded p-2"
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
                        <div className="space-y-4">
                            {renderInputField("Color Name", "name", newColor.name, handleColorChange)}
                            {renderInputField("RGB Value", "rgb", newColor.rgb, handleColorChange)}
                            {renderInputField("Hex Value", "hex", newColor.hex, handleColorChange)}
                        </div>
                    )}

                    {(selectedFilter !== "Furniture Size" && 
                      selectedFilter !== "Furniture Types" && 
                      selectedFilter !== "Colors") && (
                        renderInputField("Item Name", "itemName", newItemName, (e) => setNewItemName(e.target.value))
                    )}

                    {selectedFilter === "Furniture Size" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 font-semibold">Select Furniture Type</label>
                                <select
                                    name="filterFurnitureTypes"
                                    onChange={(e) => setSelectedFurnitureType(e.target.value)}
                                    value={selectedFurnitureType}
                                    className="w-full border rounded p-2"
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
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 font-semibold">Furniture Type Name</label>
                                <input
                                    type="text"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    className="w-full border rounded p-2"
                                    placeholder="Enter furniture type name"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-semibold">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full border rounded p-2"
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

                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded w-full"
                    >
                        Add New Item
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Maintenance;