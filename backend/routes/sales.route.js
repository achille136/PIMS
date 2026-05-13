import express from 'express'
import {addSales,getSales} from '../controllers/sales.controller.js';

const router = express.Router();

router.get('/get' ,getSales );
router.post('/add' , addSales);

export default router
