import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prismaClient';

export const getLowStockProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const threshold = 10; // arbitrary reorder threshold
    const lowStock = await prisma.product.findMany({
      where: { stock_quantity: { lt: threshold } },
    });

    res.json(lowStock);
  } catch (err) {
    next(err);
  }
};