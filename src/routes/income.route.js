import express from "express";
import requireAuth from "../middleware/auth.js"; 
import * as incomeController from "../controllers/income.controller.js";

const incomeRoute = express.Router();

incomeRoute.get("/", requireAuth, incomeController.getIncomes);
incomeRoute.get("/:id", requireAuth, incomeController.getIncomeById);
incomeRoute.post("/", requireAuth, incomeController.createIncome);
incomeRoute.put("/:id", requireAuth, incomeController.updateIncome);
incomeRoute.delete("/:id", requireAuth, incomeController.deleteIncome);
export default incomeRoute;
