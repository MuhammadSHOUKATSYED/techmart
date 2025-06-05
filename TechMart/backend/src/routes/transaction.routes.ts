import express from 'express';
import { createTransaction, getSuspiciousTransactions } from '../controllers/transaction.controller';

const router = express.Router();
router.post('/', createTransaction);
router.get('/suspicious', getSuspiciousTransactions);

export default router;
