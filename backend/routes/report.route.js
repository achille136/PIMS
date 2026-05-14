import express from 'express';
import { getDailyReport, getDailyReportCSV } from '../controllers/report.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/daily', getDailyReport);
router.get('/daily/download', getDailyReportCSV);

export default router;
