import express from 'express'
import {getMedicine,addMedicine,deleteMedicine,updateMedicine,} from '../controllers/medicine.controller.js'

const router = express.Router();

router.post('/add', addMedicine);
router.get('/get',getMedicine);
router.delete('/delete', deleteMedicine);
router.put('/update', updateMedicine);

export default router