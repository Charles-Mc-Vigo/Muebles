import React, { useEffect, useState } from "react";
import axios from "axios";

const FurnitureDashboard = () => {
    const [categories, setCategories] = useState([]);
    const [furnitureTypes, setFurnitureTypes] = useState([]);
    const [colors, setColors] = useState([]);

    // Fetch categories from the backend
    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            alert("Failed to fetch categories. Please try again.");
        }
    };

    // Fetch furniture types
    const fetchFurnitureTypes = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/furniture-types");
            setFurnitureTypes(response.data);
        } catch (error) {
            console.error("Error fetching furniture types:", error);
            alert("Failed to fetch furniture types. Please try again.");
        }
    };

    // Fetch furniture colors from the backend
    const fetchColors = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/colors");
            setColors(response.data);
        } catch (error) {
            console.error("Error fetching colors:", error);
            alert("Failed to fetch colors. Please try again.");
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchColors();
        fetchFurnitureTypes();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Furniture Dashboard</h1>
            <h2 className="text-lg font-semibold mb-2">Categories</h2>
            <table className="min-w-full border-collapse border border-gray-300 mb-4">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Category Name</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td className="border border-gray-300 p-2">{category.id}</td>
                            <td className="border border-gray-300 p-2">{category.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="text-lg font-semibold mb-2">Furniture Types</h2>
            <table className="min-w-full border-collapse border border-gray-300 mb-4">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Type Name</th>
                    </tr>
                </thead>
                <tbody>
                    {furnitureTypes.map((type) => (
                        <tr key={type.id}>
                            <td className="border border-gray-300 p-2">{type.id}</td>
                            <td className="border border-gray-300 p-2">{type.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="text-lg font-semibold mb-2">Colors</h2>
            <table className="min-w-full border-collapse border border-gray-300 mb-4">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Color Name</th>
                    </tr>
                </thead>
                <tbody>
                    {colors.map((color) => (
                        <tr key={color.id}>
                            <td className="border border-gray-300 p-2">{color.id}</td>
                            <td className="border border-gray-300 p-2">{color.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FurnitureDashboard;
