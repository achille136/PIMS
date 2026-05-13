import express from 'express';
import { getInventory, addInventory } from '../controllers/inventory.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.post('/add', addInventory);
router.get('/get', getInventory);

export default router
