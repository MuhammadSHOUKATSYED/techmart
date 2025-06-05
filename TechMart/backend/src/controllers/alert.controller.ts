import { Request, Response, NextFunction } from 'express';

export const createAlert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, level } = req.body;

    if (!message || !level) {
      return res.status(400).json({ error: 'Message and level are required' });
    }

    // Here you could log, notify, or store alerts
    console.log(`[${level.toUpperCase()}] Business Alert: ${message}`);

    res.status(201).json({ message: 'Alert created' });
  } catch (err) {
    next(err);
  }
};