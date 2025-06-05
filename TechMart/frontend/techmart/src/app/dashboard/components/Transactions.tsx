'use client';

import { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import ExportButtons from './ExportButtons'; // Adjust path as needed

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function SuspiciousTransactions() {
  const { data, error } = useSWR('http://localhost:5000/api/transactions/suspicious', fetcher);
  const [visibleCount, setVisibleCount] = useState(10);

  if (error) return <div className="text-red-600 p-4">Error loading transactions.</div>;
  if (!data) return <div className="p-4 text-gray-600">Loading transactions...</div>;

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Customer ID', key: 'customer_id' },
    { label: 'Product ID', key: 'product_id' },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Price', key: 'price' },
    { label: 'Timestamp', key: 'timestamp' },
    { label: 'Status', key: 'status' },
    { label: 'Payment Method', key: 'payment_method' },
  ];

  const displayedTransactions = data.slice(0, visibleCount);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow col-span-full">
      <h3 className="mb-4 font-semibold text-lg text-gray-800">Suspicious Transactions</h3>

      <ExportButtons
        data={data}
        columns={columns}
        filename="suspicious_transactions_report"
      />

      <div className="overflow-x-auto mt-2">
        <table className="w-full text-sm border-collapse border border-gray-200 min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">ID</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Customer ID</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Product ID</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Quantity</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Price ($)</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Timestamp</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Status</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {displayedTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No suspicious transactions found.
                </td>
              </tr>
            ) : (
              displayedTransactions.map((tx: any) => (
                <tr
                  key={tx.id}
                  className="border-t border-gray-200 even:bg-gray-50"
                >
                  <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2 text-gray-700">{tx.id}</td>
                  <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2 text-gray-700">{tx.customer_id}</td>
                  <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2 text-gray-700">{tx.product_id}</td>
                  <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2 text-gray-700">{tx.quantity}</td>
                  <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2 text-gray-700">${tx.price.toFixed(2)}</td>
                  <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2 text-gray-700">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2 text-gray-700 capitalize">{tx.status}</td>
                  <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2 text-gray-700 capitalize">{tx.payment_method}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {visibleCount < data.length && (
        <div className="text-center mt-4">
          <button
            onClick={() => setVisibleCount(prev => prev + 10)}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
