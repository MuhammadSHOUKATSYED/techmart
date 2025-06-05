import express from 'express';
import { getHourlySales } from '../controllers/analytics.controller';

const router = express.Router();
router.get('/hourly-sales', getHourlySales);

export default router;
