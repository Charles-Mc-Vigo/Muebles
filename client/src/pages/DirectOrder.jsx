import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { IoIosArrowBack } from "react-icons/io";

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
    if (furniture && newQuantity > furniture.stocks) {
      alert(`Cannot increase quantity. Only ${furniture.stocks} items available in stock.`);
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
    <div className="w-full">
      <Header />
      <div className="m-5 border-2 p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">

        <div className="flex items-center mb-5">
          <Link to="/home" className="mr-4 text-4xl text-gray-800 cursor-pointer">
            <IoIosArrowBack />
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">Direct Order for {furniture.name}</h1>
        </div>

        {/* Main Content Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Image on the Left */}
          {furniture.images && furniture.images.length > 0 && (
            <div className="bg-transparent w-full md:w-1/2 h-[400px] max-h-[400px] overflow-hidden rounded-lg shadow-md">
              <img
                src={`data:image/jpeg;base64,${furniture.images[0]}`}
                alt={furniture.name}
                className="w-full h-full object-contain p-2"
              />
            </div>
          )}

          {/* Product Details and Order Form on the Right */}
          <div className="flex flex-col justify-between w-full md:w-1/2 h-[400px] space-y-6">
            {/* Product Details */}
            <div className="space-y-4">
              <p className="text-3xl font-bold text-black">{furniture.name}</p>
              <p className="text-2xl font-semibold text-black">₱ {furniture.price}</p>
              <p className="text-black text-xl">Description: {furniture.description}</p>
              <p className="text-black text-xl">Stocks: {furniture.stocks}</p>
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Quantity Selector */}
              <div className="flex items-center">
                <label className="block font-semibold mr-4">Quantity:</label>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className="bg-gray-300 hover:bg-teal-600 text-gray-800 font-bold py-1 px-3 rounded-l"
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
                  className="bg-gray-300 hover:bg-teal-600 text-gray-800 font-bold py-1 px-3 rounded-r"
                >
                  +
                </button>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-semibold">Payment Method:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                  className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="">Select a payment method</option>
                  <option value="GCash">GCash</option>
                  <option value="Maya">Maya</option>
                  <option value="COD">Cash on Delivery</option>
                </select>
              </div>

              {/* Proof of Payment (only for GCash or Maya) */}
              {["GCash", "Maya"].includes(paymentMethod) && (
                <div>
                  <label className="block font-semibold">Proof of Payment:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-600 hover:text-teal-600"
                  />
                </div>
              )}

              {/* Place Order Button */}
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-800 text-black py-3 rounded-md transition-colors duration-300 w-full font-semibold"
              >
                Place Order
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );





};

export default DirectOrder;