import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prismaClient';
import { subHours, getHours } from 'date-fns';

export const getHourlySales = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const since = subHours(new Date(), 24);
    const transactions = await prisma.transaction.findMany({
      where: { timestamp: { gte: since } },
    });

    const salesByHour: { [key: number]: number } = {};

    for (let i = 0; i < 24; i++) salesByHour[i] = 0;

    for (const t of transactions) {
      const hour = new Date(t.timestamp).getHours();
      salesByHour[hour] += t.price * t.quantity;
    }

    const formatted = Object.entries(salesByHour).map(([hour, revenue]) => ({
      hour: Number(hour),
      revenue,
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};
