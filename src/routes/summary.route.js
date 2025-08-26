import express from "express";
import requireAuth from "../middleware/auth.js"; 
import * as summaryController from "../controllers/summary.controller.js";

const summary = express.Router();
summary.get("/", requireAuth, summaryController.getSummaryBetweenDates);
summary.get("/monthly",requireAuth, summaryController.getMonthlySummary); 
export default summary;
