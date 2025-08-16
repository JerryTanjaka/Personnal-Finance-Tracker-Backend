import express from 'express';
import { login, registerUser } from '../controllers/auth.controller.js';

const auth = express.Router()

auth.post("/sign", registerUser)
auth.post("/login", login)

export default auth