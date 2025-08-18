import { Op } from "sequelize";
import db from "../models/index.js";

const getAllExpenses = async (req, res) => {
    try {
        let { start, end, category, type } = req.query
        let conditions = {}
        let errorList = []

        if (new Date(start) == 'Invalid Date') {
            errorList.push['Invalid start date format']
            start = new Date(0)
        }
        if (new Date(end) == 'Invalid Date') {
            errorList.push['Invalid end date format']
            end = new Date(Date.now())
        }
        conditions.created_at = { [Op.between]: [start, end] }

        if (category && typeof (Number(category)) != 'number') errorList.push('Invalid category, must be a number')
        if (category && typeof (Number(category)) === 'number') {
            conditions.category_id = category
        }

        if (type && typeof (type) != 'string') errorList.push('Invalid type, must be a string')
        if (type && typeof (type) === 'string') {
            conditions.type = type
        }

        if (errorList.length > 0) return res.status(401).json({ message: 'Invalid field:', error: errorList })

        const queryAnswer = await db.Expense.findAll({
            where: { [Op.and]: conditions },
        })
        return res
            .status(200)
            .json(queryAnswer)
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const getSpecificExpense = async (req, res) => {
    try {
        const { id } = req.params

        const queryAnswer = await db.Expense.findOne({
            where: { id: Number(id) },
        })
        return res
            .status(200)
            .json(queryAnswer || [])
    } catch (err) {
        return res.status(500)
    }
}

const createExpense = async (req, res) => { }

const updateExpense = async (req, res) => { }

const deleteExpense = async (req, res) => { }

export { getAllExpenses, getSpecificExpense, createExpense, updateExpense, deleteExpense }