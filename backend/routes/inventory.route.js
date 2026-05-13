import express, { Router } from 'express';
import {getInventory,addInventory} from '../controllers/inventory.controller.js';

const router = express.Router();

router.post('/add',addInventory);
router.get('/get',getInventory);

export default router

