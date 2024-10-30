import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify

const DeliveryPage = () => {
  // Dummy data for deliveries
  const initialDeliveries = [
    {
      id: 1,
      orderId: 'ORD12345',
      deliveryDate: '2024-10-10',
      recipient: 'John Doe',
      address: '123 Main St, Cityville',
      status: 'Delivered',
    },
    {
      id: 2,
      orderId: 'ORD12346',
      deliveryDate: '2024-10-11',
      recipient: 'Jane Smith',
      address: '456 Oak Ave, Townsville',
      status: 'In Transit',
    },
    {
      id: 3,
      orderId: 'ORD12347',
      deliveryDate: '2024-10-12',
      recipient: 'Mike Johnson',
      address: '789 Pine Rd, Villageton',
      status: 'Pending',
    },
    {
      id: 4,
      orderId: 'ORD12348',
      deliveryDate: '2024-10-13',
      recipient: 'Emily Davis',
      address: '321 Maple St, Hamlet',
      status: 'Canceled',
    },
  ];

  const [deliveries, setDeliveries] = useState(initialDeliveries);

  const handleStatusChange = (id, newStatus) => {
    setDeliveries((prevDeliveries) =>
      prevDeliveries.map((delivery) =>
        delivery.id === id ? { ...delivery, status: newStatus } : delivery
      )
    );

    // Show success toast notification
    toast.success(`Delivery ID ${id} status updated to: ${newStatus}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Delivery Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                Order ID
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                Delivery Date
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                Recipient
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                Address
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">
                  {delivery.orderId}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">
                  {delivery.deliveryDate}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">
                  {delivery.recipient}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">
                  {delivery.address}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">
                  <select
                    value={delivery.status}
                    onChange={(e) => handleStatusChange(delivery.id, e.target.value)}
                    className={`border-b-2 ${
                      delivery.status === 'Delivered'
                        ? 'text-green-600'
                        : delivery.status === 'In Transit'
                        ? 'text-blue-600'
                        : delivery.status === 'Pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-800">
                  <button
                    onClick={() => handleStatusChange(delivery.id, delivery.status)}
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                  >
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer /> 
    </div>
  );
};

export default DeliveryPage;