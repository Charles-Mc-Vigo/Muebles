import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const GenerateReport = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);

  const fetchAndGenerateReport = async () => {
    try {
      setLoading(true);

      // Fetch data from the API
      const response = await fetch("http://localhost:3000/api/orders/generate-order/monthly", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      // Log the fetched data to ensure correct structure
      console.log("Fetched Data:", data);

      const orders = data.orders;
      
      if (!orders || orders.length === 0) {
        alert("No successful orders found for this month!");
        setLoading(false);
        return;
      }

      // Store the fetched orders in state
      setOrders(orders);
      setIsReportVisible(true); // Show the report once data is fetched
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add content to the PDF
    doc.setFontSize(20);
    doc.text("Successful Monthly Orders Report", 105, 10, { align: "center" });

    // Column definitions for the table
    const columns = [
      { title: "Order Number", dataKey: "orderNumber" },
      { title: "Total Amount", dataKey: "totalAmount" },
      { title: "Order Status", dataKey: "orderStatus" },
      { title: "Date", dataKey: "date" },
    ];

    // Check the orders data before mapping to rows
    console.log("Orders Data Before Mapping:", orders);

    // Map the order data into rows for the table
    const rows = orders.map((order) => ({
      orderNumber: order.orderNumber, // Ensure the correct order number is mapped
      totalAmount: `₱${order.totalAmountWithShipping.toLocaleString()}`,
      orderStatus: order.orderStatus,
      date: new Date(order.createdAt).toLocaleString(),
    }));

    // Check the rows before passing to autoTable
    console.log("Rows Data to be Passed to autoTable:", rows);

    // Add the table to the PDF
    doc.autoTable({
      head: [columns.map(col => col.title)], // Column headers
      body: rows, // Data rows
      startY: 20, // Table start position
      margin: { top: 30 }, // Adjust margins
      theme: "grid", // Add grid theme for readability
      columnStyles: {
        orderNumber: { cellWidth: 30 },
        totalAmount: { cellWidth: 30 },
        orderStatus: { cellWidth: 40 },
        date: { cellWidth: 60 },
      },
      didDrawCell: (data) => {
        if (data.column.index === 1) { // Align "Total Amount" right
          doc.text(data.cell.text, data.cell.x + data.cell.width - 10, data.cell.y + 10, {
            align: "right",
          });
        }
      },
    });

    // Download the PDF
    doc.save("Muebles_Monthly_Orders_Report.pdf");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Generate Successful Monthly Report</h1>
      <p className="mb-6 text-gray-600">
        Click the button below to fetch and view the report for successfully delivered orders. You can also download it as a PDF.
      </p>
      
      {/* Button to fetch and display data */}
      <button
        onClick={fetchAndGenerateReport}
        className={`px-6 py-3 text-white font-semibold rounded-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Report Data"}
      </button>

      {/* Display fetched orders as a table */}
      {isReportVisible && (
        <div className="mt-8 w-full max-w-4xl bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Order Number</th>
                <th className="px-4 py-2 text-left">Total Amount</th>
                <th className="px-4 py-2 text-left">Order Status</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{order.orderNumber}</td>
                  <td className="px-4 py-2">₱{order.totalAmountWithShipping.toLocaleString()}</td>
                  <td className="px-4 py-2">{order.orderStatus}</td>
                  <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-center">
            <button
              onClick={generatePDF}
              className="px-6 py-3 text-white font-semibold bg-green-600 hover:bg-green-700 rounded-md"
            >
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateReport;
