import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const Cart = () => {
	const [items, setItems] = useState([]);
	const [count, setCount] = useState(0);
	const [totalAmount, setTotalAmount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const navigate = useNavigate(); // Hook to navigate

	// Fetch cart items from the API
	const fetchCartItems = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/cart", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Failed to fetch cart items");
			}

			const data = await response.json();

			if (data.cart && data.cart.items.length > 0) {
				setItems(data.cart.items);
				setCount(data.cart.count);
				setTotalAmount(data.cart.totalAmount);
			} else {
				setItems([]);
				setCount(0);
				setTotalAmount(0);
			}

			setLoading(false);
		} catch (error) {
			setError(error.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCartItems();
	}, []);

	// Calculate total price
	const totalPrice = totalAmount.toFixed(2);

	// Handle updating the quantity of an item in the cart
	const updateQuantity = async (furnitureId, newQuantity) => {
		if (newQuantity < 1) {
			alert("Quantity cannot be less than 1");
			return;
		}

		try {
			const response = await fetch("http://localhost:3000/api/cart", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					furnitureId,
					quantity: newQuantity,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update item quantity");
			}

			fetchCartItems(); // Refresh cart after updating quantity
		} catch (error) {
			console.error("Error updating quantity:", error);
			alert("Error updating quantity");
		}
	};

	// Handle removing an item from the cart
	const removeItem = async (furnitureId) => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/cart/${furnitureId}`,
				{
					method: "DELETE",
					credentials: "include",
				}
			);

			if (!response.ok) {
				throw new Error("Failed to remove item");
			}

			fetchCartItems(); // Refresh cart after removing item
		} catch (error) {
			console.error("Error removing item:", error);
			alert("Error removing item");
		}
	};

	// Handle clearing the entire cart
	const clearCart = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/cart", {
				method: "DELETE",
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Failed to clear cart");
			}

			fetchCartItems(); // Refresh cart after clearing
		} catch (error) {
			console.error("Error clearing cart:", error);
			alert("Error clearing cart");
		}
	};

	if (loading) {
		return <div>Loading cart items...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="flex flex-col min-h-screen mt-16">
			<main className="flex-grow w-2/4 mx-auto p-4">
				<div className="flex items-center mb-4 gap-5">
					<button
						onClick={() => navigate(-1)} // Navigate to the previous page
						className="text-gray-500 mr-2"
					>
						<IoMdArrowRoundBack size={30} />
					</button>
					<h2 className="text-2xl font-semibold">Your Cart</h2>
				</div>

				{items.length === 0 ? (
					<p className="text-center text-gray-600">Your cart is empty.</p>
				) : (
					<>
						<div className="border-t border-gray-300 py-4">
							<ul className="divide-y divide-gray-300">
								{items.map((item) => (
									<li
										key={item.furnitureId._id}
										className="flex items-center justify-between py-6 px-4"
									>
										<img
											src={`data:image/jpeg;base64,${item.furnitureId.image}`} // Base64 image handling
											alt={item.furnitureId.name}
											className="w-32 h-32 object-cover mr-4"
										/>
										<div className="flex-1">
											<h3 className="text-lg font-medium">
												{item.furnitureId.name}
											</h3>
											<p className="text-gray-600">
												Price: ₱{item.furnitureId.price}
											</p>
										</div>
										<div className="flex items-center">
											<button
												className="px-3 py-1 border border-gray-400"
												onClick={() =>
													updateQuantity(
														item.furnitureId._id,
														item.quantity - 1
													)
												}
												disabled={item.quantity <= 1} // Disable if quantity is less than or equal to 1
											>
												-
											</button>
											<span className="px-4">{item.quantity}</span>
											<button
												className="px-3 py-1 border border-gray-400"
												onClick={() =>
													updateQuantity(
														item.furnitureId._id,
														item.quantity + 1
													)
												}
											>
												+
											</button>
										</div>
										<p className="ml-4 text-lg font-medium">
											₱
											{(
												parseFloat(item.furnitureId.price) * item.quantity
											).toFixed(2)}
										</p>
										<button
											className="ml-4 text-red-600 hover:text-red-800"
											onClick={() => removeItem(item.furnitureId._id)}
										>
											Remove
										</button>
									</li>
								))}
							</ul>
						</div>

						<div className="border-t border-gray-300 pt-4">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold">Subtotal:</h3>
								<p className="text-lg font-semibold">₱{totalPrice}</p>
							</div>
							<div className="flex justify-between mb-4">
								<button className="bg-blue-500 text-white px-4 py-2 rounded">
									Continue Shopping
								</button>
								<button
									className="bg-green-500 text-white px-4 py-2 rounded"
									onClick={clearCart}
								>
									Clear Cart
								</button>
							</div>
						</div>
					</>
				)}
			</main>
		</div>
	);
};

export default Cart;
