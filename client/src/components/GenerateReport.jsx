import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const GenerateReport = () => {
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [orders, setOrders] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [noOrdersMessage, setNoOrdersMessage] = useState(""); // State for no orders message

  // Fetch and generate report on component mount
  useEffect(() => {
    const fetchAndGenerateReport = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/orders/generate-order/monthly",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log("Fetched Data:", data);
        const orders = data.orders;

        if (!orders || orders.length === 0) {
          setNoOrdersMessage("No successful orders found for this month."); // Set the message
          setLoading(false);
          return;
        }

        setOrders(orders);
        setIsReportVisible(true);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchAndGenerateReport();
  }, []); // Empty dependency array means this runs once on mount

  const generatePDF = () => {
    if (!orders || orders.length === 0) {
      alert("No data available to generate the report.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Successful Monthly Orders Report", 105, 10, { align: "center" });

    const columns = [
      { title: "Order Number", dataKey: "orderNumber" },
      { title: "Total Amount", dataKey: "totalAmount" },
      { title: "Order Status", dataKey: "orderStatus" },
      { title: "Date", dataKey: "date" },
    ];

    const rows = orders.map((order) => ({
      orderNumber: order._id,
      totalAmount: `₱${(order.totalAmountWithShipping || 0).toLocaleString()}`,
      orderStatus: order.orderStatus || "N/A",
      date: new Date(order.createdAt).toLocaleString(),
    }));

    console.log("Rows for PDF:", rows); // Debugging rows data

    const totalAmount = orders.reduce(
      (sum, order) => sum + (order.totalAmountWithShipping || 0),
      0
    );

    doc.autoTable({
      head: [columns.map((col) => col.title)],
      body: rows.map((row) =>
        columns.map((col) => row[col.dataKey])
      ),
      startY: 20,
      margin: { top: 30 },
      theme: "grid",
    });

    doc.text(
      `Overall Total: ₱${totalAmount.toLocaleString()}`,
      105,
      doc.previousAutoTable.finalY + 10,
      { align: "center" }
    );

    doc.save("Muebles_Monthly_Orders_Report.pdf");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          Generate Successful Monthly Report
        </h1>
        <p className="mb-6 text-gray-600">
          The report for successfully delivered orders is shown below. You can
          also download it as a PDF.
        </p>
      </div>
      {loading ? (
        <p>Loading report...</p> // Show loading message while fetching
      ) : (
        <>
          {noOrdersMessage && (
            <p className="text-red-500">{noOrdersMessage}</p>
          )}{" "}
          {/* Display message if no orders */}
          {isReportVisible && (
            <div className="mt-8 w-full max-w-6xl bg-white rounded-lg shadow-md p-4 border-2">
              <h1 className="text-3xl font-bold text-center">Sales Report</h1>
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col text-lg">
                  <p>JC KAME WOODWORKS</p>
                  <p>Cawit, Boac, Marinduque</p>
                  <p>Phone No: 09279744104</p>
                  <p>Email: jckamewoodworks@gmail.com</p>
                </div>
                <img
                  src="../../public/landingimage/LOGO.jpg"
                  alt="Logo"
                  className="w-32 h-auto"
                />
              </div>
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Order ID</th>
                    <th className="px-4 py-2 text-left">Total Amount</th>
                    <th className="px-4 py-2 text-left">Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">{order._id}</td>
                      <td className="px-4 py-2">
                        ₱{order.totalAmountWithShipping.toLocaleString()}
                      </td>
                      <td className="px-4 py-2">{order.orderStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Display overall total */}
              <div className="mt-4 text-right text-lg font-bold">
                Total Sales: ₱
                {orders
                  .reduce(
                    (sum, order) => sum + (order.totalAmountWithShipping || 0),
                    0
                  )
                  .toLocaleString()}
              </div>
            </div>
          )}
          <div className="mt-4 text-center">
            <button
              onClick={generatePDF}
              className={`px-6 py-3 text-white font-semibold bg-green-600 hover:bg-teal-700 rounded-md ${
                orders.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={orders.length === 0}
            >
              Download as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GenerateReport;
