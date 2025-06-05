'use client';

import { Line } from 'react-chartjs-2';
import useSWR from 'swr';
import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function SalesChart() {
  const { data, error } = useSWR('/api/analytics/hourly-sales', fetcher);

  if (error) return <div>Error loading chart data</div>;
  if (!data) return <div>Loading chart...</div>;

  // Confirm data length and structure here:
  console.log('API data:', data);

  // Sort by hour ascending just in case
  const sortedData = [...data].sort((a, b) => a.hour - b.hour);

  // Create labels like "00:00", "01:00", ...
  const labels = sortedData.map((item) => item.hour.toString().padStart(2, '0') + ':00');

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenue ($)',
        data: sortedData.map((item) => item.revenue),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        pointBackgroundColor: '#3b82f6',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value.toLocaleString()}`,
        },
        title: {
          display: true,
          text: 'Revenue ($)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Hour of Day',
        },
      },
    },
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => `$${context.parsed.y.toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md col-span-full min-h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Hourly Sales (Last 24 Hours)</h3>
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
