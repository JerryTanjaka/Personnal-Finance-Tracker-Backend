import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.js"; // à créer

const router = Router();

router.post("/auth/signup", userController.signup);
router.post("/auth/login", userController.login);
router.get("/auth/me", authMiddleware, userController.me);
export default router;

