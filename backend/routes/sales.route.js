import express from 'express'
import { addSales, getSales } from '../controllers/sales.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/get', getSales);
router.post('/add', addSales);

export default router
