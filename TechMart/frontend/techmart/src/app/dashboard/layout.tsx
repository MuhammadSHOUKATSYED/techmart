// app/dashboard/layout.tsx
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="p-4 bg-white shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>
      <main className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {children}
      </main>
    </div>
  );
}