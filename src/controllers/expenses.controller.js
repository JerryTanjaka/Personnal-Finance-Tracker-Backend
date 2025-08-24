import { Op } from "sequelize";
import db from "../models/index.js";
import { deleteReceipt } from "../middleware/uploadReceipt.js";

const isNotUUID = (id) => typeof id != 'string' || id.replaceAll('-', '').length !== 32
const emptyStringToNull = (object) => {
    for (const field in object) {
        if (typeof object[field] == 'string' && object[field].trim().length == 0) {
            object[field] = null
        }
    }
    return object
}

const getAllExpenses = async (req, res) => {
    const userUUID = req.user.id
    try {
        let { start, end, category, type } = emptyStringToNull(req.query)
        let conditions = { user_id: userUUID }
        let errorList = []

        let is_recurrent = null
        if (type?.toLowerCase().includes("one-time") || type?.toLowerCase().includes("recurring")) {
            is_recurrent = ["one-time", "recurring"].indexOf(type?.toLowerCase())
        }

        if (start && String(new Date(start)) == 'Invalid Date') { errorList.push('Invalid start date format') }
        if (end && String(new Date(end)) == 'Invalid Date') { errorList.push('Invalid end date format') }
        if (category && typeof category != 'string') { errorList.push('Category must be a name') }
        if (type && is_recurrent == null) { errorList.push('Type must be a "one-time" or "recurring"') }

        if (errorList.length > 0) return res.status(400).json({ message: 'Invalid field(s)', error: errorList })

        conditions.date = { [Op.between]: [new Date(start || 0), new Date(end || Date.now())] }
        if (category) {
            const wantedCategory = await db.Category.findOne({ where: { [Op.and]: { user_id: userUUID, name: { [Op.iLike]: category } } } })
            if (wantedCategory) conditions.category_id = wantedCategory['id']
        }
        if (is_recurrent != null) {
            conditions.is_recurrent = Boolean(is_recurrent)
        }

        const queryAnswer = await db.Expense.findAll({
            where: { [Op.and]: conditions },
            include: [{
                association: 'category_fk',
                attributes: ["name"]
            }],
            order: [['date', 'DESC']]
        })
        return res.status(200).json(queryAnswer)
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const getSpecificExpense = async (req, res) => {
    const userUUID = req.user.id
    try {
        const { id } = req.params

        if (isNotUUID(id)) return res.status(400).json({ message: 'Invalid field', error: 'Incorrect expense ID' })


        const queryAnswer = await db.Expense.findOne({
            where: { [Op.and]: { id: id, user_id: userUUID } },
            include: [{
                association: 'category_fk',
                attributes: ["name"]
            }],
        })
        return queryAnswer ? res.status(200).json(queryAnswer) : res.status(404).json({ message: 'No such expense' })
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}


const createExpense = async (req, res) => {
    try {
        const userUUID = req.user.id
        let { amount, date, categoryId, description, type, startDate, endDate } = emptyStringToNull(req.body)

        let is_recurrent = false
        if (type?.toLowerCase().includes("one-time") || type?.toLowerCase().includes("recurring")) {
            is_recurrent = ["one-time", "recurring"].indexOf(type.toLowerCase())
        } else {
            if (req.file) deleteReceipt(req.file.path)
            return res.status(400).json({ message: 'Invalid type', error: 'Please choose a valid type' })
        }

        if (amount || isNaN(parseFloat(amount))) {
            if (req.file) deleteReceipt(req.file.path)
            return res.status(400).json({ message: 'Invalid Amount', error: 'Please input a valid amount' })
        }

        if (!date || String(new Date(date)) == 'Invalid date') {
            if (req.file) deleteReceipt(req.file.path)
            return res.status(400).json({ message: 'Invalid Date', error: 'Invalid expense date' })
        }

        if (!is_recurrent) {
            startDate = null
            endDate = null
        } else if (!startDate) {
            if (req.file) deleteReceipt(req.file.path)
            return res.status(400).json({ message: 'Invalid StartDate', error: 'Recurrent expense must have a valid start date' })
        }

        if (categoryId) {
            const categoryExists = await db.Category.findOne({ where: { [Op.and]: { id: categoryId, user_id: userUUID } } })
            if (!categoryExists) {
                if (req.file) deleteReceipt(req.file.path)
                return res.status(400).json({ message: 'Invalid Category', error: 'Category does not exist' })
            }
        }

        let receipt_id = null
        if (req.file) {
            receipt_id = req.file.filename.split('.')[0]
            await db.Receipt.create({ id: receipt_id, file_path: req.file.path, user_id: userUUID })
        }

        const newExpense = db.Expense.build({ user_id: userUUID, amount, date, category_id: categoryId, description, is_recurrent, start_date: startDate, end_date: endDate, receipt_id })
        return await newExpense.save().then(() => res.status(201).json(newExpense))
    } catch (err) {
        if (req.file) deleteReceipt(req.file.path)
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const updateExpense = async (req, res) => {
    try {
        const userUUID = req.user.id
        const { id } = req.params
        const { amount, categoryId, type, startDate, endDate } = emptyStringToNull(req.body)

        if (isNotUUID(id)) {
            if (req.file) deleteReceipt(req.file.path)
            return res.status(400).json({ message: 'Invalid expense ID', error: 'ID must be an UUID' })
        }

        const currentExpense = await db.Expense.findOne({ where: { [Op.and]: { id: id, user_id: userUUID } } });
        if (!currentExpense) {
            if (req.file) deleteReceipt(req.file.path)
            return res.status(404).json({ message: 'No match found' })
        }

        if (isNaN(parseFloat(amount))) {
            if (req.file) deleteReceipt(req.file.path)
            return res.status(400).json({ message: 'Invalid Amount', error: 'Amount must be a number' })
        }
        
        if (categoryId) {
            const categoryExists = await db.Category.findOne({ where: { [Op.and]: { id: categoryId, user_id: userUUID } } })
            if (!categoryExists) {
                if (req.file) deleteReceipt(req.file.path)
                return res.status(400).json({ message: 'Invalid Category', error: 'Category does not exist' })
            }
            req.body.category_id = categoryExists['id']
        }

        if (type?.toLowerCase().includes("one-time") || type?.toLowerCase().includes("recurring")) {
            currentExpense['is_recurrent'] = Boolean(["one-time", "recurring"].indexOf(type?.toLowerCase()))
        }

        if (currentExpense['is_recurrent']) {
            req.body['start_date'] = startDate
            req.body['end_date'] = endDate
        } else {
            currentExpense['start_date'] = null
            currentExpense['end_date'] = null
        }

        for (const field in currentExpense.toJSON()) {
            if (req.body[field] == '') { req.body[field] = currentExpense[field] }
            if (field in req.body && req.body[field]) {
                currentExpense[field] = req.body[field]
            }
        }

        if (currentExpense['is_recurrent'] && !currentExpense['start_date']) {
            if (req.file) deleteReceipt(req.file.path)
            return res.status(400).json({ message: 'Invalid StartDate', error: 'Reccuring expenses require a start date' })
        }

        if (req.file) {
            const receipt_id = req.file.filename.split('.')[0]
            if (currentExpense['receipt_id']) await db.Receipt.findOne({ where: { [Op.and]: { id: currentExpense['receipt_id'], user_id: userUUID } } })
                .then((resolve) => deleteReceipt(resolve['file_path']))
                .catch((rej) => res.status(500).json({ message: 'Failed to delete old receipt file', error: rej }))
                .then(() => db.Receipt.destroy({ where: { [Op.and]: { id: currentExpense['receipt_id'], user_id: userUUID } } }))
                .catch((rej) => res.status(500).json({ message: 'Failed to delete old receipt', error: rej }))
            db.Receipt.create({ id: receipt_id, file_path: req.file.path, user_id: userUUID })
            currentExpense['receipt_id'] = receipt_id
        }

        return await currentExpense.save()
            .then(() => res.status(200).json(currentExpense))
            .catch(err => {
                if (req.file) deleteReceipt(req.file.path)
                res.status(500).json({ message: 'Failed to apply changes', error: err })
            })
    } catch (err) {
        if (req.file) deleteReceipt(req.file.path)
        return res.status(500).json({ message: 'Failed to update record', error: err.message })
    }
}

const deleteExpense = async (req, res) => {
    const userUUID = req.user.id
    try {
        const { id } = req.params;

        if (isNotUUID(id)) return res.status(400).json({ message: 'Invalid expense ID', error: 'ID must be an UUID' })

        const expenseToDelete = await db.Expense.findOne({ where: { [Op.and]: { id: id, user_id: userUUID } } })
        if (!expenseToDelete) { return res.status(404).json({ message: 'No expense with such ID' }) }

        if (expenseToDelete['receipt_id']) await db.Receipt.findOne({ where: { [Op.and]: { id: expenseToDelete['receipt_id'], user_id: userUUID } } })
            .then((resolve) => deleteReceipt(resolve['file_path']))
            .catch((rej) => res.status(500).json({ message: 'Failed to delete receipt file', error: rej }))
            .then(() => db.Receipt.destroy({ where: { [Op.and]: { id: expenseToDelete['receipt_id'], user_id: userUUID } } }))
            .catch((rej) => res.status(500).json({ message: 'Failed to delete receipt', error: rej }))

        return await expenseToDelete.destroy()
            .then(() => res.status(200).json({ message: 'Deletion successful' }))
            .catch((rej) => res.status(500).json({ message: 'Failed to delete expense', error: rej }))
    } catch (err) {
        if (req.file) deleteReceipt(req.file.path)
        return res.status(500).json({ message: 'Failed to delete the record', error: err.message })
    }
}

export { getAllExpenses, getSpecificExpense, createExpense, updateExpense, deleteExpense }