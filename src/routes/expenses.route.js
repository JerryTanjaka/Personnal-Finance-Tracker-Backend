import express from 'express'
import { createExpense, deleteExpense, getAllExpenses, getSpecificExpense, updateExpense } from '../controllers/expenses.controller.js'
import { uploadReceipt, MulterErrorHandler } from '../middleware/uploadReceipt.js'

const expenses = express.Router()

expenses.get('/', getAllExpenses)
expenses.get('/:id', getSpecificExpense)
expenses.post('/', uploadReceipt, MulterErrorHandler, createExpense)
expenses.put('/:id', uploadReceipt, MulterErrorHandler, updateExpense)
expenses.delete('/:id', deleteExpense)

export default expenses