import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ViewCustomerOrder = ({ orderId }) => {
    const [order, setOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:3000/api/admin/order/${orderId}`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.error || "Failed to fetch order details.");
                return;
            }
            const existingOrder = await response.json();
            setOrder(existingOrder);
            setOrderItems(existingOrder.items || []);
        } catch (error) {
            console.log("Error fetching order", error);
            toast.error("An error occurred while fetching order details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return <p className="text-center">Loading order details...</p>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Order Details</h2>
            <table className="min-w-full border">
                <tbody>
                    <tr>
                        <td className="border px-4 py-2"><strong>Name:</strong> {order.user?.firstname} {order.user?.lastname}</td>
                        <td className="border px-4 py-2"><strong>Order ID:</strong> {order.orderNumber}</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
                        <td className="border px-4 py-2"><strong>Payment Method:</strong> {order.paymentMethod || "N/A"}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="border px-4 py-2">
                            <strong>Status:</strong>
                            <span className={`${
                                order.orderStatus === "pending"
                                    ? "text-yellow-600"
                                    : "text-green-700"
                            } font-semibold`}>
                                {order.orderStatus}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="border-b pb-6 mb-6">
                <h2 className="text-2xl font-semibold text-green-700 mb-4">Items</h2>
                <table className="min-w-full border">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Item</th>
                            <th className="border px-4 py-2">Quantity</th>
                            <th className="border px-4 py-2">Price</th>
                            <th className="border px-4 py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems.length > 0 ? (
                            orderItems.map((item) => (
                                <tr key={item._id} className="border-b">
                                    <td className="border px-4 py-2 flex items-center">
                                        {item.furniture.images.length > 0 && (
                                            <img
                                                src={`data:image/jpeg;base64,${item.furniture.images[0]}`}
                                                alt={item.furniture.name}
                                                className="w-20 h-20 object-cover mr-4 rounded-md"
                                            />
                                        )}
                                        {item.furniture.name}
                                    </td>
                                    <td className="border px-4 py-2">{item.quantity}</td>
                                    <td className="border px-4 py-2">₱{item.price.toFixed(2)}</td>
                                    <td className="border px-4 py-2">₱{(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="border px-4 py-2 text-gray-600">No items found for this order.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <p className="text-right text-xl font-semibold mt-4 text-green-700">
                    Total: ₱{order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
                </p>
            </div>
            {order.proofOfPayment && (
                <div className="border-b pb-6 mb-6 ">
                    <h2 className="text-2xl font-semibold text-green-700 mb-4">Proof of Payment</h2>
                    <div className="flex items-start gap-8">
                        <div className="min-w-[300px] max-w-[300px] h-[400px] overflow-hidden border rounded-md">
                            <img
                                src={`data:image/jpeg;base64,${order.proofOfPayment}`}
                                alt="Proof of Payment"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            {/* Additional order details or delivery information can go here */}
                            <h3 className="font-semibold">Delivery Information</h3>
                            {/* Add any additional delivery information here */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewCustomerOrder;