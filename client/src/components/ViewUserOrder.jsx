import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewUserOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    } catch (error) {
      toast.error("An error occurred while fetching order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

//   const handleAccept = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/api/admin/update/${orderId}`, {
//         method: "PUT",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: "accepted" }), // Change status as needed
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         toast.error(errorData.error || "Failed to accept the order.");
//         return;
//       }
//       toast.success("Order accepted successfully!");
//       fetchOrder(); // Refresh order details
//     } catch (error) {
//       toast.error("An error occurred while accepting the order.");
//     }
//   };

  const handleCancel = async () => {
	try {
	  const response = await fetch(`http://localhost:3000/api/admin/cancel/${orderId}`, {
		method: "PUT",
		credentials: "include",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify({ status: "cancelled" }), // Include this if required by the API
	  });
	  if (!response.ok) {
		const errorData = await response.json();
		toast.error(errorData.error || "Failed to cancel the order.");
		return;
	  }
	  toast.success("Order canceled successfully!");
	  fetchOrder();
	} catch (error) {
	  toast.error("An error occurred while canceling the order.");
	}
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-black">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-black">Order not found</p>
      </div>
    );
  }

  const orderItems = Array.isArray(order.items) ? order.items : [];

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto p-6 flex flex-col">
        <div className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="text-black">
            <IoMdArrowRoundBack size={30} />
          </button>
          <h1 className="ml-4 text-3xl font-bold text-black">Order Details</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-black mb-4">Order Summary</h2>
            <ul className="space-y-2 text-black">
              <li>
                <span className="font-medium text-xl text-gray-800">Name:</span>{" "}
                {order.user.firstname} {order.user.lastname}
              </li>
              <li>
                <span className="font-medium text-xl text-gray-800">Order ID:</span>{" "}
                {order.orderNumber}
              </li>
              <li>
                <span className="font-medium text-xl text-gray-800">Date:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </li>
              <li>
                <span className="font-medium text-xl text-gray-800">Payment Method:</span>{" "}
                {order.paymentMethod || "N/A"}
              </li>
              <li>
                <p className="ml-1 text-base text-black">
                  Address:
                  {order.user.addresses
                    .filter((address) => address.isDefault)
                    .map((defaultAddress, index) => (
                      <p key={index} className="tracking-wide mt-1">
                        {defaultAddress.streetAddress},{" "}
                        {defaultAddress.barangay}, {defaultAddress.municipality}
                        , {defaultAddress.zipCode}
                      </p>
                    ))}
                </p>
              </li>
              <li>
                <span className="font-medium text-xl text-gray-800">Status:</span>{" "}
                <span
                  className={`${
                    order.orderStatus === "pending"
                      ? "text-yellow-600"
                      : "text-green-700"
                  } font-semibold`}
                >
                  {order.orderStatus}
                </span>
              </li>
            </ul>
          </div>
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left font-medium text-black">Item</th>
                    <th className="py-3 px-4 text-left font-medium text-black">Quantity</th>
                    <th className="py-3 px-4 text-left font-medium text-black">Price</th>
                    <th className="py-3 px-4 text-left font-medium text-black">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-black flex items-center">
                        {item.furniture.images.length > 0 && (
                          <img
                            src={`data:image/jpeg;base64,${item.furniture.images[0]}`}
                            alt={item.furniture.name}
                            className="w-12 h-12 object-cover mr-4 rounded-md"
                          />
                        )}
                        {item.furniture.name}
                      </td>
                      <td className="py-3 px-4 text-black">{item.quantity}</td>
                      <td className="py-3 px-4 text-black">₱{item.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-black">₱{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-right font-medium text-xl text-gray-800">
              Total: ₱{order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
            </p>
          </div>
        </div>
        <div>
          {/* Proof of Payment */}
          {order.proofOfPayment && (
            <div className="bg-white rounded-lg shadow-md p-6 my-5">
              <h2 className="text-lg font-medium text-gray-700 mb-4">Proof of Payment</h2>
              <img
                src={`data:image/jpeg;base64,${order.proofOfPayment}`}
                alt="Proof of Payment"
                className="w-full max-w-sm mx-auto rounded-md"
              />
              <div className="flex justify-end space-x-4 mt-4">
               
                <button 
                  onClick={handleCancel}
                  className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Cancel
                </button>
				<button 
                  onClick={handleAccept}
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Accept
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default ViewUserOrder;