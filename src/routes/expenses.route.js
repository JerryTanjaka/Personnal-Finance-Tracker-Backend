import express from 'express'
import { createExpense, deleteExpense, getAllExpenses, getSpecificExpense, updateExpense } from '../controllers/expenses.controller.js'
import { uploadReceipt } from '../middleware/uploadReceipt.js'

const expenses = express.Router()

expenses.get('/', getAllExpenses)
expenses.get('/:id', getSpecificExpense)
expenses.post('/', uploadReceipt.single('receipt'), createExpense)
expenses.put('/:id', uploadReceipt.single('receipt'), updateExpense)
expenses.delete('/:id', deleteExpense)

export default expenses