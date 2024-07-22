import axios from 'axios';
import React, { useState } from 'react';

export default function Furnitures() {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    category: '',
    furnitureType: '',
    description: '',
    price: '',
    image: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post("http://localhost:3000/api/furnitures/create", formData);
      console.log(response.data);
      // Optionally, clear the form or show a success message
    } catch (error) {
      console.error("Something went wrong!", error);
      setError(error.response?.data?.message || error.message || "Error creating furniture");
    }
  };

  return (
    <div className="h-screen flex bg-slate-400 items-center justify-center flex-col">
      <form className='flex flex-col gap-5 w-1/4' onSubmit={handleSubmit}>
      {formData.image && <img width={100} height={100} src={formData.image} alt="Uploaded furniture" />}
      <input 
        className="p-3 rounded-lg" 
        type="file" 
        accept='image/*' 
        id='image' 
        onChange={handleImageUpload} 
        required 
      />
        <input 
          className="p-2 rounded-lg" 
          type="text" 
          id="category" 
          value={formData.category} 
          onChange={handleInputChange} 
          placeholder='Category' 
          required 
        />
        <input 
          className="p-2 rounded-lg" 
          type="text" 
          id="furnitureType" 
          value={formData.furnitureType} 
          onChange={handleInputChange} 
          placeholder='Furniture type' 
          required 
        />
        <input 
          className="p-2 rounded-lg" 
          type="text" 
          id="description" 
          value={formData.description} 
          onChange={handleInputChange} 
          placeholder='Description' 
          required 
        />
        <input 
          className="p-2 rounded-lg" 
          type="number" 
          id="price" 
          value={formData.price} 
          onChange={handleInputChange} 
          placeholder='Price' 
          required 
        />
        <button 
          type="submit" 
          className="bg-slate-800 text-white font-semibold p-2 rounded-lg hover:opacity-80">
          Create
        </button>
      </form>
    </div>
  );
}
