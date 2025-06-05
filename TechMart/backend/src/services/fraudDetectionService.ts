import prisma from '../utils/prismaClient';
import axios from 'axios';

export const getGeoLocation = async (ip: string) => {
  try {
    const { data } = await axios.get(`https://ipapi.co/${ip}/json/`);
    return { country: data.country_name || 'Unknown', city: data.city, region: data.region };
  } catch {
    return { country: 'Unknown', city: '', region: '' };
  }
};

export const detectFraudSignals = async ({
  customer_id,
  amount,
  ip,
  timestamp,
}: {
  customer_id: number;
  amount: number;
  ip: string;
  timestamp: Date;
}) => {
  const signals: string[] = [];

  // Velocity check: 3+ txs in 5 minutes
  const txCount = await prisma.transaction.count({
    where: {
      customer_id,
      timestamp: { gte: new Date(Date.now() - 5 * 60 * 1000) },
    },
  });
  if (txCount >= 3) signals.push('velocity');

  // Amount anomaly: > 2.5x average
  const txs = await prisma.transaction.findMany({ where: { customer_id } });
  const total = txs.reduce((sum, t) => sum + t.quantity * t.price, 0);
  const avg = txs.length > 0 ? total / txs.length : 0;
  if (avg > 0 && amount > 2.5 * avg) signals.push('amount-anomaly');

  // Odd hour purchase
  const hour = timestamp.getUTCHours();
  if (hour < 5 || hour > 23) signals.push('odd-hour');

  // Geographic mismatch
  const geo = await getGeoLocation(ip);
  const customer = await prisma.customer.findUnique({ where: { id: customer_id } });
  if (customer?.billing_country && customer.billing_country !== geo.country) {
    signals.push('geo-mismatch');
  }

  return { signals, geo };
};

export const determineSeverity = (signals: string[]) => {
  if (signals.includes('amount-anomaly') && signals.includes('velocity')) return 'high';
  if (signals.length >= 2) return 'medium';
  if (signals.length === 1) return 'low';
  return 'none';
};