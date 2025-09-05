import express from "express";
import { getReceiptByID } from "../controllers/receipts.controller.js";

const receipts = express.Router()

receipts.get('/:idExpense', getReceiptByID)

export default receipts