import express from 'express';
import { createShop, getShops } from '../controllers/shop.controller';

const router = express.Router();

router.post('/create', createShop);
router.get('/all', getShops);

export default router;