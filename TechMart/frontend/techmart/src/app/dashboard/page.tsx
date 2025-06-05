// app/dashboard/page.tsx
import Header from './components/Header';
import SalesChart from './components/SalesChart';
import LowStockProducts from './components/LowStockProducts';
import Transactions from './components/Transactions';

export default function DashboardPage() {
  return (
    <>
      <Header />
      <SalesChart />
      <LowStockProducts />
      <Transactions />
    </>
  );
}