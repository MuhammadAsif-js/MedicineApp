import express from 'express';
import { addStock, getShopInventory } from '../controllers/inventory.controller';

const router = express.Router();

router.post('/add', addStock);
router.get('/:shopId', getShopInventory);

export default router;