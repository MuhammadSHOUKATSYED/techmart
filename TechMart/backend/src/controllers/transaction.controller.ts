import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prismaClient';
import { getIO } from '../sockets/index'
import { detectFraudSignals, determineSeverity } from '../services/fraudDetectionService';

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_id, product_id, quantity, price, status, payment_method } = req.body;

    const amount = quantity * price;
    if (amount < 0.01 || amount > 10000) {
      return res.status(400).json({ error: 'Transaction amount must be between $0.01 and $10,000' });
    }

    const product = await prisma.product.findUnique({ where: { id: product_id } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        customer_id,
        product_id,
        quantity,
        price,
        status,
        payment_method,
      },
    });

    await prisma.product.update({
      where: { id: product_id },
      data: { stock_quantity: { decrement: quantity } },
    });

    const allTransactions = await prisma.transaction.findMany({ where: { customer_id } });
    const totalSpent = allTransactions.reduce((sum, t) => sum + t.price * t.quantity, 0);
    const avgAmount = totalSpent / allTransactions.length;

    const risk_score = avgAmount > 5000 ? 0.8 : avgAmount > 1000 ? 0.5 : 0.2;
    await prisma.customer.update({
      where: { id: customer_id },
      data: { total_spent: totalSpent, risk_score },
    });

    // 🛡️ Fraud Detection
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || '';
    const { signals, geo } = await detectFraudSignals({ customer_id, amount, ip, timestamp: transaction.timestamp });
    const severity = determineSeverity(signals);

    if (signals.length > 0) {
      getIO().emit('fraud-alert', {
        transaction_id: transaction.id,
        customer_id,
        signals,
        severity,
        geo,
        timestamp: transaction.timestamp,
      });
    }

    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};


export const getSuspiciousTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Define timeframe for rapid transactions and unusual amounts
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Suspicious transactions: either high price or recent transactions within last hour
    const suspicious = await prisma.transaction.findMany({
      where: {
        OR: [
          { price: { gt: 5000 } },
          { timestamp: { gte: oneHourAgo } },
        ],
      },
      orderBy: { timestamp: 'desc' },
    });

    res.json(suspicious);
  } catch (err) {
    next(err);
  }
};
