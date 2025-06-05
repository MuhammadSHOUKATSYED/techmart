import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prismaClient';
import { subHours } from 'date-fns';

export const getOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const since = subHours(new Date(), 24);

    const transactions = await prisma.transaction.findMany({
      where: { timestamp: { gte: since } },
    });

    const totalRevenue = transactions.reduce((sum, t) => sum + t.price * t.quantity, 0);
    const totalTransactions = transactions.length;
    const totalItemsSold = transactions.reduce((sum, t) => sum + t.quantity, 0);

    res.json({ totalRevenue, totalTransactions, totalItemsSold });
  } catch (err) {
    next(err);
  }
};
