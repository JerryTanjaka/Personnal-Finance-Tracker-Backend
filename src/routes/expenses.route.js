import express from 'express'
import { createExpense, deleteExpense, getAllExpenses, getSpecificExpense, updateExpense } from '../controllers/expenses.controller.js'

const expenses = express.Router()

expenses.get('/', getAllExpenses)
expenses.get('/:id', getSpecificExpense)
expenses.post('/', createExpense)
expenses.put('/:id', updateExpense)
expenses.delete('/:id', deleteExpense)

export default expenses