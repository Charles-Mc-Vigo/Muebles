import React from 'react';

const TransactionHistory = () => {
  const dummyTransactions = [
    { id: 1, customerName: 'John Doe', amount: 120.5, date: '2024-10-01', paymentMethod: 'Credit Card' },
    { id: 2, customerName: 'Jane Smith', amount: 250.0, date: '2024-10-05', paymentMethod: 'PayPal' },
    { id: 3, customerName: 'Michael Brown', amount: 89.99, date: '2024-09-28', paymentMethod: 'Debit Card' },
    { id: 4, customerName: 'Lucy Green', amount: 350.75, date: '2024-10-12', paymentMethod: 'Bank Transfer' },
    { id: 5, customerName: 'Chris Blue', amount: 190.99, date: '2024-10-03', paymentMethod: 'Credit Card' },
    { id: 6, customerName: 'Linda White', amount: 480.5, date: '2024-09-25', paymentMethod: 'PayPal' },
    { id: 7, customerName: 'James Black', amount: 70.99, date: '2024-10-07', paymentMethod: 'Debit Card' },
    { id: 8, customerName: 'Patricia Johnson', amount: 660.0, date: '2024-09-22', paymentMethod: 'Credit Card' },
    { id: 9, customerName: 'Robert King', amount: 320.2, date: '2024-10-10', paymentMethod: 'PayPal' },
    { id: 10, customerName: 'Sophia Williams', amount: 140.3, date: '2024-09-30', paymentMethod: 'Bank Transfer' },
  ];

  return (
    <div className="p-6 lg:p-8">
      <h2 className="text-3xl font-bold mb-6">Transaction History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white border-collapse shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-5 text-left font-semibold border-b">Transaction ID</th>
              <th className="py-3 px-5 text-left font-semibold border-b">Customer Name</th>
              <th className="py-3 px-5 text-left font-semibold border-b">Amount</th>
              <th className="py-3 px-5 text-left font-semibold border-b">Transaction Date</th>
              <th className="py-3 px-5 text-left font-semibold border-b">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {dummyTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-100">
                <td className="py-3 px-5 border-b">{transaction.id}</td>
                <td className="py-3 px-5 border-b">{transaction.customerName}</td>
                <td className="py-3 px-5 border-b">${transaction.amount.toFixed(2)}</td>
                <td className="py-3 px-5 border-b">{transaction.date}</td>
                <td className="py-3 px-5 border-b">{transaction.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
