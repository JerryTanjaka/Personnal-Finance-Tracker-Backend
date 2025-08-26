import express from 'express';
const router = express.Router();
import { changePassword } from '../controllers/auth.controller.js';
import requireAuth from '../middleware/auth.js';

router.post('/change-password', requireAuth, changePassword);

export default router;
