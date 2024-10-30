import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DirectOrder = () => {
  const { furnitureId } = useParams();
  const [furniture, setFurniture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [proofOfPayment, setProofOfPayment] = useState(null);
  const [quantity, setQuantity] = useState(1); // New state for quantity
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/furnitures/${furnitureId}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch furniture details');
        }
        const data = await response.json();
        setFurniture(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFurniture();
  }, [furnitureId]);

  const handleFileChange = (e) => {
    setProofOfPayment(e.target.files[0]);
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;

    // Prevent quantity from going below 1
    if (newQuantity < 1) {
      alert("Quantity cannot be less than 1.");
      return;
    }

    // Prevent quantity from exceeding available stock
    if (furniture && newQuantity > furniture.stocks.stocks) {
      alert(`Cannot increase quantity. Only ${furniture.stocks.stocks} items available in stock.`);
      return;
    }

    setQuantity(newQuantity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('paymentMethod', paymentMethod);
    formData.append('quantity', quantity); // Include quantity in the form data
    if (proofOfPayment) {
      formData.append('proofOfPayment', proofOfPayment);
    }
    try {
      const response = await fetch(`http://localhost:3000/api/orders/direct-order/${furnitureId}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      const data = await response.json();
      const orderId = data.order._id;
      alert('Order created successfully!');
      navigate(`/order-details/${orderId}`);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="text-center"><div className="loader"></div></div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!furniture) return <div className="text-center">No furniture found</div>;

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold mb-4 text-center">Direct Order for {furniture.name}</h1>
      <div className="bg-white shadow-md rounded-lg p-5 mb-6">
        {furniture.images && furniture.images.length > 0 && (
          <img
            src={`data:image/jpeg;base64,${furniture.images[0]}`}
            alt={furniture.name}
            className="w-25 h-25 rounded-lg mb-4"
          />
        )}
        <p className="text-xl font-semibold">Price: ₱{furniture.price}</p>
        <p className="mt-2 text-gray-700">{furniture.description}</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-5 space-y-4">
        <div className="flex items-center mb-4">
          <label className="block font-semibold mr-4">Quantity:</label>
          <button 
            type="button" 
            onClick={() => handleQuantityChange(-1)} 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-l"
          >
            -
          </button>
          <input 
            type="number" 
            value={quantity} 
            readOnly
            className="border text-center w-16 py-1 rounded-md mx-1"
          />
          <button 
            type="button" 
            onClick={() => handleQuantityChange(1)} 
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-r"
          >
            +
          </button>
        </div>
        <div>
          <label className="block font-semibold">Payment Method:</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
            required
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a payment method</option>
            <option value="GCash">GCash</option>
            <option value="Maya">Maya</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>
        {["GCash", "Maya"].includes(paymentMethod) && (
          <div>
            <label className="block font-semibold">Proof of Payment:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              required
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}
        <button 
          type="submit" 
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-300 w-full"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default DirectOrder;