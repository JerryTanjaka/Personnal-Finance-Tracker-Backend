/** @format */

import express from "express";
import { getProfile, googleLogin, login, refreshLogin, registerUser, signCookie } from "../controllers/auth.controller.js";
import requireAuth from "../middleware/auth.js";

const auth = express.Router();

auth.use(signCookie);

auth.post("/signup", registerUser);
auth.post("/login", login);
auth.post("/google", googleLogin);
auth.post("/refreshlogin", refreshLogin);
auth.get("/me", requireAuth, getProfile);

export default auth;
