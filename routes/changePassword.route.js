const express = require('express');
const router = express.Router();
const { changePassword } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

// Route to change user's password
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;
