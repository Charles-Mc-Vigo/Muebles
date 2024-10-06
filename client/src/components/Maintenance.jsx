import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Table = ({ headers, data }) => {
    return (
        <table className="min-w-full border-collapse border border-gray-300 mb-6">
            <thead className="bg-gray-200">
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} className="border border-gray-300 p-2 text-left font-semibold text-gray-700">
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
                        {Object.values(row).map((cell, cellIndex) => (
                            <td key={cellIndex} className="border border-gray-300 p-2">
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

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

    useEffect(() => {
        const fetchData = async () => {
            await fetchCategories(); // Fetch categories
            await fetchFurnitureTypes(); // Fetch furniture types
            await fetchColors(); // Fetch colors
            await fetchSizes(); // Fetch sizes
        };
        fetchData();
    }, []);

    const fetchFurnitureTypes = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/furniture-types");
            const data = await response.json();
            setFurnitureTypes(data);
        } catch (error) {
            console.error("Error fetching furniture types:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/categories");
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const fetchColors = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/colors");
            const data = await response.json();
            setColors(data);
        } catch (error) {
            console.error("Failed to fetch colors:", error);
        }
    };

    const fetchSizes = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/sizes");
            const data = await response.json();
            setSizes(data);
        } catch (error) {
            console.error("Failed to fetch sizes:", error);
        }
    };

    const handleAddNewSize = async () => {
        if (!newSize.label || !selectedFurnitureType) {
            toast.error("Please enter a valid size name and select a furniture type.");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/api/sizes/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    label: newSize.label,
                    height: newSize.height,
                    length: newSize.length,
                    width: newSize.width,
                    depth: newSize.depth,
                    furnitureTypeId: selectedFurnitureType,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                resetInputFields();
                await fetchSizes(); // Refresh sizes list
            } else {
                const errorData = await response.json();
                toast.error(errorData.message);
            }
        } catch (error) {
            console.error("Error adding size:", error);
            toast.error("Failed to add size");
        }
    };

    const handleColorChange = (e) => {
        const { name, value } = e.target;
        setNewColor((prevColor) => ({ ...prevColor, [name]: value }));
    };

    const handleAddNewColor = async () => {
        if (!newColor.name || !newColor.rgb || !newColor.hex) {
            toast.error("Please provide all color details.");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/api/colors/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newColor.name,
                    rgb: newColor.rgb,
                    hex: newColor.hex,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                console.log("Response Error:", data);
                throw new Error(data.message || "Failed to add color.");
            }
            toast.success("Color added successfully.");
            resetInputFields(); // Reset fields after adding color
            await fetchColors(); // Refresh colors list
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleAddNewItem = async () => {
        if (!newItemName && selectedFilter !== "Furniture Size" && selectedFilter !== "Colors") {
            toast.error("Please enter a valid name.");
            return;
        }
        try {
            if (selectedFilter === "Categories") {
                const response = await fetch("http://localhost:3000/api/categories/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name: newItemName }),
                });
                if (!response.ok) {
                    throw new Error("Failed to add category.");
                }
                toast.success("Category added successfully.");
                await fetchCategories(); // Refresh categories list
            }
            if (selectedFilter === "Furniture Types") {
                if (!selectedCategory) {
                    toast.error("Please select a category.");
                    return;
                }
                const response = await fetch("http://localhost:3000/api/furniture-types/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: newItemName,
                        categoryId: selectedCategory,
                    }),
                });
                if (!response.ok) {
                    throw new Error("Failed to add furniture type.");
                }
                const newFurnitureType = await response.json();
                setFurnitureTypes((prevTypes) => [...prevTypes, newFurnitureType]);
                toast.success("Furniture type added successfully.");
            }
            resetInputFields();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const resetInputFields = () => {
        setNewItemName("");
        setNewColor(initialColorState);
        setNewSize(initialSizeState);
        setSelectedFurnitureType("");
        setSelectedCategory(""); // Reset the selected category
    };

    const renderInputField = (
        label,
        name,
        value,
        onChange,
        type = "text",
        placeholder
    ) => (
        <div className="mb-4" key={name}>
            <label className="block mb-1 font-semibold text-gray-700">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border rounded-lg p-2 shadow-sm focus:ring focus:ring-blue-300"
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
                JCKAME Maintenance
            </h1>
            <div className="flex flex-row justify-between">
                {/* Left Side for Form */}
                <div className="w-1/2 pr-4">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (selectedFilter === "Furniture Size") {
                                handleAddNewSize();
                            } else if (selectedFilter === "Colors") {
                                handleAddNewColor();
                            } else {
                                handleAddNewItem();
                            }
                        }}
                        className="mb-6 space-y-4 bg-gray-100 p-4 rounded-lg shadow-md"
                    >
                        <div className="mb-4">
                            <label className="block mb-1 font-semibold text-gray-700">Select Type</label>
                            <select
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value)}
                                className="w-full border rounded-lg p-2 shadow-sm focus:ring focus:ring-blue-300"
                            >
                                <option value="">-- Select --</option>
                                <option value="Categories">Categories</option>
                                <option value="Furniture Types">Furniture Types</option>
                                <option value="Furniture Size">Furniture Size</option>
                                <option value="Colors">Colors</option>
                            </select>
                        </div>

                        {/* Dynamic Input Fields */}
                        {selectedFilter === "Categories" && renderInputField("New Category", "newCategory", newItemName, (e) => setNewItemName(e.target.value))}
                        {selectedFilter === "Furniture Types" && (
                            <>
                                {renderInputField("New Furniture Type", "newFurnitureType", newItemName, (e) => setNewItemName(e.target.value))}
                                <div className="mb-4">
                                    <label className="block mb-1 font-semibold text-gray-700">Select Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full border rounded-lg p-2 shadow-sm focus:ring focus:ring-blue-300"
                                    >
                                        <option value="">-- Select --</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                        {selectedFilter === "Furniture Size" && (
                            <>
                                {renderInputField("Label", "label", newSize.label, (e) => setNewSize({ ...newSize, label: e.target.value }))}
                                {renderInputField("Height", "height", newSize.height, (e) => setNewSize({ ...newSize, height: e.target.value }), "number")}
                                {renderInputField("Length", "length", newSize.length, (e) => setNewSize({ ...newSize, length: e.target.value }), "number")}
                                {renderInputField("Width", "width", newSize.width, (e) => setNewSize({ ...newSize, width: e.target.value }), "number")}
                                {renderInputField("Depth", "depth", newSize.depth, (e) => setNewSize({ ...newSize, depth: e.target.value }), "number")}
                                <div className="mb-4">
                                    <label className="block mb-1 font-semibold text-gray-700">Select Furniture Type</label>
                                    <select
                                        value={selectedFurnitureType}
                                        onChange={(e) => setSelectedFurnitureType(e.target.value)}
                                        className="w-full border rounded-lg p-2 shadow-sm focus:ring focus:ring-blue-300"
                                    >
                                        <option value="">-- Select --</option>
                                        {furnitureTypes.map((type) => (
                                            <option key={type._id} value={type._id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                        {selectedFilter === "Colors" && (
                            <>
                                {renderInputField("Color Name", "name", newColor.name, handleColorChange)}
                                {renderInputField("RGB Value", "rgb", newColor.rgb, handleColorChange)}
                                {renderInputField("Hex Value", "hex", newColor.hex, handleColorChange)}
                            </>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-green-800 text-white rounded-lg p-2 font-semibold hover:bg-green-700 transition duration-200"
                        >
                            Add New {selectedFilter}
                        </button>
                    </form>
                </div>

                {/* Right Side for Tables */}
                <div className="w-1/2 pl-4">
                    {selectedFilter === "Categories" && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold mb-4">Categories</h2>
                            <div className="max-h-96 overflow-y-auto"> {/* Fixed height for scrolling */}
                                <Table
                                    headers={["ID", "Category Name"]}
                                    data={categories.map((category) => ({
                                        id: category._id,
                                        name: category.name,
                                    }))}
                                />
                            </div>
                        </div>
                    )}

                    {selectedFilter === "Furniture Types" && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold mb-4">Furniture Types</h2>
                            <div className="max-h-96 overflow-y-auto"> {/* Fixed height for scrolling */}
                                <Table
                                    headers={["ID", "Furniture Type", "Category"]}
                                    data={furnitureTypes.map((type) => ({
                                        id: type._id,
                                        name: type.name,
                                        category: categories.find((cat) => cat._id === type.categoryId)?.name || "N/A",
                                    }))}
                                />
                            </div>
                        </div>
                    )}

                    {selectedFilter === "Furniture Size" && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold mb-4">Furniture Sizes</h2>
                            <div className="max-h-96 overflow-y-auto"> {/* Fixed height for scrolling */}
                                <Table
                                    headers={["ID", "Label", "Height", "Length", "Width", "Depth", "Furniture Type"]}
                                    data={sizes.map((size) => ({
                                        id: size._id,
                                        label: size.label,
                                        height: size.height,
                                        length: size.length,
                                        width: size.width,
                                        depth: size.depth,
                                        furnitureType: furnitureTypes.find((type) => type._id === size.furnitureTypeId)?.name || "N/A",
                                    }))}
                                />
                            </div>
                        </div>
                    )}

                    {selectedFilter === "Colors" && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold mb-4">Furniture Colors</h2>
                            <div className="max-h-96 overflow-y-auto"> {/* Fixed height for scrolling */}
                                <Table
                                    headers={["ID", "Color Name", "RGB", "Hex"]}
                                    data={colors.map((color) => ({
                                        id: color._id,
                                        name: color.name,
                                        rgb: color.rgb,
                                        hex: color.hex,
                                    }))}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Maintenance;
