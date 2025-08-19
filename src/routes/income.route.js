import express from "express";
import { auth } from "../middleware/auth.js"; 
import * as incomeController from "../controllers/incomeController.js";

const router = express.Router();

router.get("/", auth, incomeController.getIncomes);
router.get("/:id", auth, incomeController.getIncomeById);
router.post("/", auth, incomeController.createIncome);
router.put("/:id", auth, incomeController.updateIncome);
router.delete("/:id", auth, incomeController.deleteIncome);
export default router;
