'use client';

import Link from 'next/link';
import { ClockIcon, LockClosedIcon, ChartBarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Logo icon */}
        <Cog6ToothIcon className="mb-6 w-20 h-20 text-blue-600" />

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Welcome to <span className="text-blue-600">TechMart</span>
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mb-8 text-gray-600">
          Discover cutting-edge tech products, track sales in real time, and simplify inventory management.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
          >
            Launch Dashboard
          </Link>
          <a
            href="#features"
            className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose TechMart?</h2>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center">
            <ClockIcon className="w-20 h-20 mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Real-Time Monitoring</h3>
            <p className="text-gray-600 text-sm">
              Instantly track stock levels, purchases, and alerts with live dashboards.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center">
            <LockClosedIcon className="w-20 h-20 mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Secure by Design</h3>
            <p className="text-gray-600 text-sm">
              Built with robust authentication, validation, and fraud detection systems.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center">
            <ChartBarIcon className="w-20 h-20 mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Powerful Insights</h3>
            <p className="text-gray-600 text-sm">
              Generate reports, export data, and visualize trends to make better decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-sm text-gray-500 text-center mt-20 py-6 border-t border-gray-200">
        © {new Date().getFullYear()} TechMart. All rights reserved.
      </footer>
    </div>
  );
}
