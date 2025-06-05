import express from 'express';
import { createAlert } from '../controllers/alert.controller';

const router = express.Router();

router.post('/', createAlert);

export default router;