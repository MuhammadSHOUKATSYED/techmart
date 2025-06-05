import express from 'express';
import { getLowStockProducts } from '../controllers/inventory.controller';

const router = express.Router();
router.get('/low-stock', getLowStockProducts);

export default router;
