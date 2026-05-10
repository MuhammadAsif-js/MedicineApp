import express from 'express';
import { createShop, getShops, getShopAnalytics, getLowStockAlerts } from '../controllers/shop.controller';

const router = express.Router();

router.post('/create', createShop);
router.get('/all', getShops);
router.get('/:shopId/analytics', getShopAnalytics);
router.get('/:shopId/alerts', getLowStockAlerts);

export default router;