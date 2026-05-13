import express from 'express'
import { getMedicine, addMedicine, deleteMedicine, updateMedicine } from '../controllers/medicine.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router();

router.use(requireAuth);

router.post('/add', addMedicine);
router.get('/get', getMedicine);
router.delete('/delete/:medicineID', deleteMedicine);
router.put('/update/:medicineID', updateMedicine);

export default router
