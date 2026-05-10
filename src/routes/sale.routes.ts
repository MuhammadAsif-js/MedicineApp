import express from 'express';
import { checkout } from '../controllers/sale.controller';

const router = express.Router();

router.post('/checkout', checkout);

export default router;