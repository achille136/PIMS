import express from 'express';
import { getDailyReport } from '../controllers/report.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/daily', getDailyReport);

export default router;
