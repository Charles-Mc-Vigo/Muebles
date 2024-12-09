import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";  // Import XLSX library for Excel export
import "jspdf-autotable";

const GenerateReport = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [noOrdersMessage, setNoOrdersMessage] = useState("");

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
        const orders = data.orders;

        if (!orders || orders.length === 0) {
          setNoOrdersMessage("No successful orders found for this month.");
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
  }, []);

  // Sort orders by quantity in descending order
  const sortedOrders = [...orders].sort((a, b) => b.quantity - a.quantity);

  // Find the most purchased furniture (the one with the highest quantity)
  const mostPurchasedItem = sortedOrders[0];

  const generatePDF = () => {
    const doc = new jsPDF();

    // Set title
    doc.setFontSize(20);
    doc.text("Successful Monthly Orders Report", 105, 10, { align: "center" });

    // Add company details
    doc.setFontSize(12);
    doc.text("JC KAME WOODWORKS", 20, 30);
    doc.text("Cawit, Boac, Marinduque", 20, 35);
    doc.text("Phone No: 09279744104", 20, 40);
    doc.text("Email: jckamewoodworks@gmail.com", 20, 45);

    // Add logo
    const logoPath = "http://localhost:3000/landingimage/LOGO.jpg"; // Correct path
    doc.addImage(logoPath, "JPEG", 160, 20, 30, 30);

    // Define columns for the "Orders" table
    const columns = [
      { title: "Order Number", dataKey: "orderNumber" },
      { title: "Total Amount", dataKey: "totalAmount" },
      { title: "Order Status", dataKey: "orderStatus" },
      { title: "Date", dataKey: "date" },
    ];

    const rows = orders.map((order) => ({
      orderNumber: order.orderNumber,
      totalAmount: `₱${order.totalAmountWithShipping.toLocaleString()}`,
      orderStatus: order.orderStatus,
      date: new Date(order.createdAt).toLocaleString(),
    }));

    if (rows.length > 0) {
      doc.autoTable({
        head: [columns.map((col) => col.title)],
        body: rows,
        startY: 60,
        margin: { top: 30 },
        theme: "grid",
      });
    }

    // Add overall total at the bottom
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.totalAmountWithShipping,
      0
    );
    doc.text(
      `Overall Total: ₱${totalAmount.toLocaleString()}`,
      105,
      doc.previousAutoTable.finalY + 10,
      { align: "center" }
    );

    // Add "Most Purchased Items" section
    doc.text("Most Purchased Items", 20, doc.previousAutoTable.finalY + 20);

    if (mostPurchasedItem) {
      doc.text(
        `The most purchased furniture this month is ${mostPurchasedItem.orderNumber} with a quantity of ${mostPurchasedItem.quantity}.`,
        20,
        doc.previousAutoTable.finalY + 30
      );
    }

    // Define columns for the "Most Purchased Items" table
    const mostPurchasedColumns = [
      { title: "Date", dataKey: "date" },
      { title: "Product Name", dataKey: "productName" },
      { title: "Order Quantity", dataKey: "quantity" },
      { title: "Total Amount", dataKey: "totalAmount" },
    ];

    const mostPurchasedRows = sortedOrders.map((order) => ({
      date: new Date(order.createdAt).toLocaleString(),
      productName: order.productName,  // Ensure the correct field is used for product name
      quantity: order.quantity,
      totalAmount: `₱${order.totalAmountWithShipping.toLocaleString()}`,
    }));

    doc.autoTable({
      head: [mostPurchasedColumns.map((col) => col.title)],
      body: mostPurchasedRows,
      startY: doc.previousAutoTable.finalY + 40,
      margin: { top: 30 },
      theme: "grid",
    });

    // Save the PDF
    doc.save("Muebles_Monthly_Orders_Report.pdf");
  };
  const exportToExcel = () => {
    // Prepare data for overall orders
    const overallOrdersData = orders.map((order) => ({
      "Order Number": order.orderNumber,
      "Total Amount": `₱${order.totalAmountWithShipping.toLocaleString()}`,
      "Order Status": order.orderStatus,
      "Date": new Date(order.createdAt).toLocaleString(),
    }));
  
    // Prepare data for most purchased items
    const mostPurchasedData = sortedOrders.map((order) => ({
      "Date": new Date(order.createdAt).toLocaleString(),
      "Product Name": order.productName,  // Ensure the correct field is used for product name
      "Order Quantity": order.quantity,
      "Total Amount": `₱${order.totalAmountWithShipping.toLocaleString()}`,
    }));
  
    // Create a new workbook
    const wb = XLSX.utils.book_new();
  
    // Create worksheets
    const overallOrdersSheet = XLSX.utils.json_to_sheet(overallOrdersData);
    const mostPurchasedSheet = XLSX.utils.json_to_sheet(mostPurchasedData);
  
    // Insert company details into the overall orders sheet
    XLSX.utils.sheet_add_aoa(overallOrdersSheet, [
      ["JC KAME WOODWORKS"],
      ["Cawit, Boac, Marinduque"],
      ["Phone No: 09279744104"],
      ["Email: jckamewoodworks@gmail.com"],
      [], // Empty row for spacing
    ], { origin: "A1" });
  
    // Insert company details into the most purchased items sheet
    XLSX.utils.sheet_add_aoa(mostPurchasedSheet, [
      ["JC KAME WOODWORKS"],
      ["Cawit, Boac, Marinduque"],
      ["Phone No: 09279744104"],
      ["Email: jckamewoodworks@gmail.com"],
      [], // Empty row for spacing
    ], { origin: "A1" });
  
    // Add worksheets to the workbook
    XLSX.utils.book_append_sheet(wb, overallOrdersSheet, "Overall Orders");
    XLSX.utils.book_append_sheet(wb, mostPurchasedSheet, "Most Purchased Items");
  
    // Write the workbook to a file and trigger download
    XLSX.writeFile(wb, "Muebles_Monthly_Orders_Report.xlsx");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Generate Successful Monthly Report</h1>
        <p className="mb-6 text-gray-600">
          The report for successfully delivered orders is shown below. You can
          also download it as a PDF or Excel file.
        </p>
      </div>
      {loading ? (
        <p>Loading report...</p>
      ) : (
        <>
          {noOrdersMessage && <p className="text-red-500">{noOrdersMessage}</p>}
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
                  src="/landingimage/LOGO.jpg" // Use absolute path for the logo
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
                      <td className="px-4 py-2">{order.orderNumber}</td>
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
                  .reduce((sum, order) => sum + order.totalAmountWithShipping, 0)
                  .toLocaleString()}
              </div>
              {/* Popular Sales */}
              <h1 className="mt-2 text-xl font-semibold text-black">Most Purchased Items</h1>
              <p className="mt-2 text-md font-semibold text-gray-700">
                The most purchased furniture this month is{" "}
                {mostPurchasedItem.furniture.name} with a quantity of{" "}
                {mostPurchasedItem.quantity}.
              </p>
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Product Name</th>
                    <th className="px-4 py-2 text-left">Order Quantity</th>
                    <th className="px-4 py-2 text-left">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((order, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">{order.furniture.name}</td>
                      <td className="px-4 py-2">{order.quantity}</td>
                      <td className="px-4 py-2">
                        ₱{order.totalAmountWithShipping.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 text-center">
            <button
              onClick={generatePDF}
              className={`px-6 py-3 text-white font-semibold bg-green-600 hover:bg-teal-700 rounded-md ${orders.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={true}
            >
              Download as PDF
            </button>
            <button
              onClick={exportToExcel}
              className={`ml-4 px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md ${orders.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={orders.length === 0}
            >
              Download as Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GenerateReport;
