import express from 'express';
import { login, registerUser, getProfile } from '../controllers/auth.controller.js';
import requireAuth from '../middleware/auth.js';

const auth = express.Router()

auth.post("/signup", registerUser)
auth.post("/login", login)
auth.get("/me", requireAuth, getProfile)

export default auth