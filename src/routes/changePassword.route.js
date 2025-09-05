import express from 'express';
const router = express.Router();
import { changePassword } from '../controllers/auth.controller.js';
import requireAuth from '../middleware/auth.js';
import { getProfileInfo, deleteUserData, deleteUserAccount } from '../controllers/user.controller.js';

router.post('/change-password', requireAuth, changePassword);
router.get('/profile', requireAuth, getProfileInfo)
// Delete all user data (incomes, expenses, receipts, categories, refresh tokens).
// Protected route: requires valid access token. Does NOT delete the user account itself.
router.delete('/delete-data', requireAuth, deleteUserData)
router.delete('/deleteAccount', requireAuth, deleteUserAccount)

export default router;
