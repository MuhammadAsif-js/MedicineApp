import { Router } from 'express';
import { addMedicine, getMedicines } from '../controllers/medicine.controller';

const router = Router();

router.post('/add', addMedicine);
router.get('/all', getMedicines); 

export default router;