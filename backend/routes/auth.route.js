import express from 'express';
import { register, login, logout, me } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', me);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);

export default router;
