import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const EditProduct = () => {
    const { furnitureId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [furnitureTypes, setFurnitureTypes] = useState([]);
    const [filteredFurnitureTypes, setFilteredFurnitureTypes] = useState([]);
    const [materials, setMaterials] = useState([]); // Initialize as empty
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]); // Initialize as empty
    const [furnitureData, setFurnitureData] = useState({
        images: [],
        name: "",
        category: "",
        furnitureType: "",
        description: "",
        materials: [],
        colors: [],
        sizes: [],
        price: "",
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [
                    furnitureResponse,
                    categoriesResponse,
                    furnitureTypesResponse,
                    materialsResponse,
                    colorsResponse,
                    sizesResponse,
                ] = await Promise.all([
                    fetch(`http://localhost:3000/api/furnitures/${furnitureId}`, {
                        credentials: "include",
                    }),
                    fetch("http://localhost:3000/api/categories"),
                    fetch("http://localhost:3000/api/furniture-types"),
                    fetch("http://localhost:3000/api/materials"),
                    fetch("http://localhost:3000/api/colors"),
                    fetch("http://localhost:3000/api/sizes"),
                ]);

                if (!furnitureResponse.ok) throw new Error("Failed to fetch furniture data");
                if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
                if (!furnitureTypesResponse.ok) throw new Error("Failed to fetch furniture types");
                if (!materialsResponse.ok) throw new Error("Failed to fetch materials");
                if (!colorsResponse.ok) throw new Error("Failed to fetch colors");
                if (!sizesResponse.ok) throw new Error("Failed to fetch sizes");

                const furnitureData = await furnitureResponse.json();
                const categoriesData = await categoriesResponse.json();
                const furnitureTypesData = await furnitureTypesResponse.json();
                const materialsData = await materialsResponse.json();
                const colorsData = await colorsResponse.json();
                const sizesData = await sizesResponse.json();

                setCategories(categoriesData);
                setFurnitureTypes(furnitureTypesData);
                setMaterials(materialsData);
                setColors(colorsData);
                setSizes(sizesData);

                // Set initial furniture data for editing
                setFurnitureData({
                    name: furnitureData.name,
                    description: furnitureData.description,
                    price: furnitureData.price,
                    category: furnitureData.category._id,
                    furnitureType: furnitureData.furnitureType._id,
                    materials: furnitureData.materials.map(m => m._id),
                    colors: furnitureData.colors.map(c => c._id),
                    sizes: furnitureData.sizes.map(s => s._id),
                    images: furnitureData.images || [],
                });

                const imageUrls = furnitureData.images.map(img => `data:image/jpeg;base64,${img}`);
                setPreviewImages(imageUrls);

                // Filter furniture types based on the selected category
                const selectedCategoryId = furnitureData.category._id; // Assuming it's an object
                setFilteredFurnitureTypes(furnitureTypesData.filter(type => type.categoryId === selectedCategoryId));

                // Set materials and sizes based on the selected furniture type
                const selectedFurnitureTypeId = furnitureData.furnitureType._id; // Assuming it's an object
                const selectedFurnitureType = furnitureTypesData.find(type => type._id === selectedFurnitureTypeId);
                if (selectedFurnitureType) {
                    setMaterials(selectedFurnitureType.materials); // Assuming materials is an array of objects
                    setSizes(selectedFurnitureType.sizes); // Assuming sizes is an array of objects
                }
            } catch (error) {
                toast.error(error.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [furnitureId]);

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setFurnitureData(prev => ({
            ...prev,
            category: categoryId,
            furnitureType: "", // Reset furniture type when category changes
        }));
        setFilteredFurnitureTypes(furnitureTypes.filter(type => type.categoryId === categoryId));
        // Clear materials and sizes when category changes
        setMaterials([]);
        setSizes([]);
    };

    const handleFurnitureTypeChange = (e) => {
        const furnitureTypeId = e.target.value;
        setFurnitureData((prev) => ({
            ...prev,
            furnitureType: furnitureTypeId,
        }));

        // Clear materials and sizes if no furniture type is selected
        if (!furnitureTypeId) {
            setMaterials([]);
            setSizes([]);
            return;
        }

        // Find the selected furniture type
        const selectedFurnitureType = furnitureTypes.find(type => type._id === furnitureTypeId);
        if (selectedFurnitureType) {
            // Update materials and sizes based on the selected furniture type
            setMaterials(selectedFurnitureType.materials); // Assuming materials is an array of objects
            setSizes(selectedFurnitureType.sizes); // Assuming sizes is an array of objects
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFurnitureData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMultipleSelect = (field, value) => {
        setFurnitureData(prev => {
            const currentValues = prev[field];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return {
                ...prev,
                [field]: newValues,
            };
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(prev => [...prev, ...files]);
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    };

    const removeImage = (index) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        Object.keys(furnitureData).forEach(key => {
            if (Array.isArray(furnitureData[key])) {
                furnitureData[key].forEach(value => formData.append(key, value));
            } else {
                formData.append(key, furnitureData[key]);
            }
        });
        imageFiles.forEach(file => formData.append("images", file));

        try {
            const response = await fetch(`http://localhost:3000/api/furnitures/edit/${furnitureId}`, {
                method: "PUT",
                body: formData,
                credentials: "include",
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update product");
            }
            toast.success("Product updated successfully!");
            navigate(-1);
        } catch (error) {
            toast.error(error.message || "Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader loading={loading} size={50} color="#007bff" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {previewImages.map((preview, index) => (
                            <div key={index} className="relative">
                                <img src={preview} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded" />
                                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 text-red-700 text-3xl rounded-full p-1 hover:bg-red-600 focus:outline-none">×</button>
                            </div>
                        ))}
                    </div>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500" />
                </div>
                {/* Product Details Section */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" value={furnitureData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select name="category" value={furnitureData.category} onChange={handleCategoryChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Furniture Type</label>
                        <select name="furnitureType" value={furnitureData.furnitureType} onChange={handleFurnitureTypeChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="">Select Furniture Type</option>
                            {filteredFurnitureTypes.map(type => (
                                <option key={type._id} value={type._id}>{type.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input type="number" name="price" value={furnitureData.price} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" value={furnitureData.description} onChange={handleInputChange} rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                {/* Materials Section */}
                <div className="mt-4 mb-4 bg-slate-200 rounded-md px-5 py-2">
                    <label className="block font-semibold">Materials:</label>
                    <div className="flex flex-wrap">
                        {materials.length > 0 ? (
                            materials.map((material) => (
                                <label key={material._id} className="flex items-center w-1/3 p-2">
                                    <input
                                        type="checkbox"
                                        name="material"
                                        value={material._id}
                                        checked={furnitureData.materials.includes(material._id)}
                                        onChange={() => handleMultipleSelect('materials', material._id)} // Ensure this function handles adding/removing materials
                                        className="mr-2 h-4 w-4 border rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">{material.name}</span>
                                </label>
                            ))
                        ) : (
                            <span className="text-gray-500">No materials available</span>
                        )}
                    </div>
                </div>

                {/* Sizes Section */}
                <div className="mb-4 bg-slate-200 rounded-md p-2">
                    <label className="block font-semibold my-2 mb-2">
                        Sizes:{" "}
                        <span className="font-light">(Height X Width X Length X Depth)</span>
                    </label>
                    <div className="flex flex-wrap">
                        {sizes.length > 0 ? (
                            sizes.map((size) => (
                                <label key={size._id} className="flex items-center w-1/3 p-2">
                                    <input
                                        type="checkbox"
                                        name="sizes"
                                        value={size._id}
                                        checked={furnitureData.sizes.includes(size._id)}
                                        onChange={() => handleMultipleSelect('sizes', size._id)} // Ensure this function handles adding/removing sizes
                                        className="mr-2 h-4 w-4 border rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">
                                        {size.label} <span className="text-gray-500 italic">({size.height} X {size.width} X {size.length} X {size.depth})</span>
                                    </span>
                                </label>
                            ))
                        ) : (
                            <p className="text-gray-500">No sizes available</p>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white font-medium py-3 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none">
                    {loading ? "Updating..." : "Update Product"}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EditProduct;