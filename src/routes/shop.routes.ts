import { Router } from 'express';
import { createShop } from '../controllers/shop.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post('/create', requireAuth, createShop);

export default router;