import express from 'express';
const router = express.Router();
import { changePassword } from '../controllers/auth.controller.js';
import requireAuth from '../middleware/auth.js';
import { getProfileInfo } from '../controllers/user.controller.js';

router.post('/change-password', requireAuth, changePassword);
router.get('/profile', requireAuth, getProfileInfo)

export default router;
