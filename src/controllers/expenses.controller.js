import { Op } from "sequelize";
import db from "../models/index.js";

const getAllExpenses = async (req, res) => {
    const userUUID = req.user.id
    try {
        let { start, end, category, type } = req.query
        let conditions = { user_id: userUUID }
        let errorList = []

        if (new Date(start) == 'Invalid Date') {
            errorList.push['Invalid start date format']
            start = new Date(0)
        }
        if (new Date(end) == 'Invalid Date') {
            errorList.push['Invalid end date format']
            end = new Date(Date.now())
        }
        conditions.expense_date = { [Op.between]: [start, end] }

        if (category && typeof (Number(category)) != 'number') errorList.push('Invalid category, must be a number')
        if (category && typeof (Number(category)) === 'number') {
            conditions.category_id = category
        }

        if (type && typeof (type) != 'string') errorList.push('Invalid type, must be a string')
        if (type && typeof (type) === 'string') {
            conditions.type = type
        }

        if (errorList.length > 0) return res.status(400).json({ message: 'Invalid field:', error: errorList })

        const queryAnswer = await db.Expense.findAll({
            where: { [Op.and]: conditions },
            include: [{
                association: 'category_fk',
                attributes: ["name"]
            }, {
                association: 'user_fk',
                attributes: ["email"]
            }],
            order: [['expense_date', 'DESC']]
        })
        return res
            .status(200)
            .json(queryAnswer)
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const getSpecificExpense = async (req, res) => {
    const userUUID = req.user.id
    const { id } = req.params

    if (id.replaceAll('-', '').length !== 32) return res.status(400).json('Invalid expense ID')

    try {

        const queryAnswer = await db.Expense.findOne({
            where: { [Op.and]: { id: id, user_id: userUUID } },
            include: [{
                association: 'category_fk',
                attributes: ["name"]
            }, {
                association: 'user_fk',
                attributes: ["email"]
            }
            ],
        })
        return res
            .status(200)
            .json(queryAnswer || 'No such expense')
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}


// IMPORTANT: Need to get the user UUID from Authentification (requireAuth cannot pass it)
const createExpense = async (req, res) => {
    let { amount, expense_date, category_id, description, is_recurrent, start_date, end_date } = req.body

    if (!(amount && expense_date && category_id)) {
        return res.status(400).json({ message: 'Missing field', field: Object.keys(req.body).filter(field => !req.body[field]) })
    }

    if (!is_recurrent) {
        start_date = null
        end_date = null
    }

    if (is_recurrent && !start_date) {
        return res.status(400).json({ message: 'Recurrent expense must have a valid start date' })
    }

    try {
        const userUUID = req.user.id

        const newExpense = await db.Expense.create({ user_id: userUUID, amount, expense_date, category_id, description, is_recurrent, start_date, end_date })

        return res.status(201).json({ message: 'Expense created', Expense: { user_id: userUUID, amount, expense_date, category_id, description, is_recurrent, start_date, end_date } })

    } catch (err) { return res.status(500).json({ message: 'Server error', error: err.message }) }
}

const updateExpense = async (req, res) => {
    const userUUID = req.user.id
    const { id } = req.params

    if (id.replaceAll('-', '').length !== 32) return res.status(400).json('Invalid expense ID')

    const currentExpense = await db.Expense.findOne({ where: { [Op.and]: { id: id, user_id: userUUID } } });
    if (!currentExpense) return res.status(400).json('No match found')

    for (const field in currentExpense.toJSON()) {
        if (field in req.body) {
            currentExpense[field] = req.body[field]
        }
    }

    currentExpense.save()
        .then(() => res.status(200).json(currentExpense))
        .catch(err => res.status(500).json({ message: 'Failed to apply changes', error: err }))
}

const deleteExpense = async (req, res) => {
    const userUUID = req.user.id
    const { id } = req.params;

    if (id.replaceAll('-', '').length !== 32) return res.status(400).json('Invalid expense ID')

    try {
        const deleteExpense = await db.Expense.destroy({ where: { [Op.and]: { id: id, user_id: userUUID } } })
        return (deleteExpense) ? res.status(200).json('Deletion successful') : res.status(400).json('No expense with such ID')
    } catch (err) {
        return res.status(500).json({ message: 'Failed to delete the record', error: err.message })
    }
}

export { getAllExpenses, getSpecificExpense, createExpense, updateExpense, deleteExpense }