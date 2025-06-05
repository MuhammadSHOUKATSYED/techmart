'use client';

import useSWR from 'swr';
import axios from 'axios';
import { DollarSign, ShoppingCart, Package } from 'lucide-react';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function Header() {
  const { data } = useSWR('/api/dashboard/overview', fetcher, { refreshInterval: 5000 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-80 gap-y-8 max-w-7xl mx-auto px-4 py-6">
      <MetricCard
        title="Total Revenue"
        value={`$${data?.totalRevenue?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) || '0.00'}`}
        icon={<DollarSign className="w-6 h-6 text-green-500" />}
        bg="bg-green-50"
      />
      <MetricCard
        title="Transactions"
        value={data?.totalTransactions || 0}
        icon={<ShoppingCart className="w-6 h-6 text-blue-500" />}
        bg="bg-blue-50"
      />
      <MetricCard
        title="Items Sold"
        value={data?.totalItemsSold || 0}
        icon={<Package className="w-6 h-6 text-orange-500" />}
        bg="bg-orange-50"
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div
      className={`min-w-[280px] max-w-full p-6 rounded-2xl shadow border border-gray-200 hover:shadow-md transition duration-200 ${bg}`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
        {icon}
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 break-all">
        {value}
      </h2>
    </div>
  );
}
