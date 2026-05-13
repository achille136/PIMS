import express from 'express';
import { addCategory,getcategories,updateCategory,deleteCategories} from '../controllers/category.controller.js';

const router = express.Router();

router.post('/add', addCategory);
router.get('/get', getcategories);
router.delete('/delete', deleteCategories);
router.put('/update',updateCategory);

export default router