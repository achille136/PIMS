import express from 'express';
import { addCategory, getcategories, updateCategory, deleteCategories } from '../controllers/category.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.post('/add', addCategory);
router.get('/get', getcategories);
router.delete('/delete/:categoryID', deleteCategories);
router.put('/update/:categoryID', updateCategory);

export default router;
