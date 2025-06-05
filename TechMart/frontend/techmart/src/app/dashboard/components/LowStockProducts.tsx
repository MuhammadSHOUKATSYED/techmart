'use client';

import { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import clsx from 'clsx';
import ExportButtons from './ExportButtons'; // adjust path if needed

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function LowStockProducts() {
  const { data, error } = useSWR('http://localhost:5000/api/inventory/low-stock', fetcher);
  const [visibleCount, setVisibleCount] = useState(10);

  if (error) return <div className="text-red-600 p-4">Error loading low stock products.</div>;
  if (!data) return <div className="p-4 text-gray-600">Loading low stock products...</div>;

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Category', key: 'category' },
    { label: 'Price', key: 'price' },
    { label: 'Stock Qty', key: 'stock_quantity' },
    { label: 'Status', key: 'status' },
  ];

  const transformedData = data.map((product: any) => ({
    ...product,
    status: product.stock_quantity <= 5 ? 'Extremely Low Stock' : 'Low Stock',
  }));

  const displayedData = transformedData.slice(0, visibleCount);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow col-span-full">
      <h3 className="mb-4 font-semibold text-lg text-gray-800">Low Stock Products</h3>

      <ExportButtons
        data={transformedData}
        columns={columns}
        filename="low_stock_products_report"
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-gray-200 min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">ID</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Name</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Category</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Price ($)</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Stock Qty</th>
              <th className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No low stock products found.
                </td>
              </tr>
            ) : (
              displayedData.map((product: any) => {
                const isLowStock = product.stock_quantity <= 5;
                return (
                  <tr
                    key={product.id}
                    className="border-t border-gray-200 even:bg-gray-50"
                  >
                    <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2 text-gray-700">{product.id}</td>
                    <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2 text-gray-900 font-medium">{product.name}</td>
                    <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2 text-gray-700">{product.category}</td>
                    <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2 text-gray-700">${product.price.toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2 text-gray-700">{product.stock_quantity}</td>
                    <td className="border border-gray-300 px-2 py-1 sm:px-3 sm:py-2">
                      <span
                        className={clsx(
                          'inline-block px-2 py-1 text-xs font-semibold rounded-full',
                          isLowStock
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        )}
                      >
                        {isLowStock ? 'Extremely Low Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Show More Button */}
      {visibleCount < transformedData.length && (
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
