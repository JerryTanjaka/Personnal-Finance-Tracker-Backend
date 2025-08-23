import { Op } from "sequelize";
import db from "../models/index.js";
import { deleteReceiptOnFail } from "../middleware/uploadReceipt.js";

const isUUID = (id) => typeof id != 'string' || id.replaceAll('-', '').length !== 32

const getAllExpenses = async (req, res) => {
    const userUUID = req.user.id
    try {
        let { start, end, category, is_recurrent } = req.query
        let conditions = { user_id: userUUID }
        let errorList = []

        if (start && String(new Date(start)) == 'Invalid Date') { errorList.push('Invalid start date format') }
        if (end && String(new Date(end)) == 'Invalid Date') { errorList.push('Invalid end date format') }
        if (category && typeof category != 'string') { errorList.push('Category must be a name') }
        if (is_recurrent && typeof (is_recurrent.toLowerCase().includes("true")) != 'boolean') { errorList.push('Reccurent must be a true or false') }

        if (errorList.length > 0) return res.status(400).json({ message: 'Invalid field', error: errorList })

        conditions.expense_date = { [Op.between]: [new Date(start || 0), new Date(end || Date.now())] }
        if (category) {
            const wantedCategory = await db.Category.findOne({ where: { [Op.and]: { user_id: userUUID, name: { [Op.iLike]: category } } } })
            if (wantedCategory) conditions.category_id = wantedCategory['id']
        }
        if (is_recurrent) {
            conditions.is_recurrent = is_recurrent.toLowerCase().includes("true")
        }

        const queryAnswer = await db.Expense.findAll({
            where: { [Op.and]: conditions },
            include: [{
                association: 'category_fk',
                attributes: ["name"]
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
    try {
        const { id } = req.params

        if (isUUID(id)) return res.status(400).json({ message: 'Invalid field', error: 'Incorrect expense ID' })


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
        let { amount, expense_date, category_name, description, is_recurrent, start_date, end_date } = req.body

        if (!(amount && expense_date)) {
            if (req.file) deleteReceiptOnFail(req.file.path)
            return res.status(400).json({ message: 'Missing field', error: Object.keys(req.body).filter(field => !req.body[field]) })
        }

        if (!is_recurrent) {
            start_date = null
            end_date = null
        }

        if (is_recurrent && !start_date) {
            if (req.file) deleteReceiptOnFail(req.file.path)
            return res.status(400).json({ message: 'Invalid field', error: 'Recurrent expense must have a valid start date' })
        }

        const userUUID = req.user.id

        let receipt_id = null

        const categoryExists = await db.Category.findOne({ where: { [Op.and]: { name: { [Op.iLike]: category_name }, user_id: userUUID } } })
        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid field', error: 'Category does not exist' })
        }

        if (req.file) {
            receipt_id = req.file.filename.split('.')[0]
            await db.Receipt.create({ id: receipt_id, file_path: req.file.path, user_id: userUUID })
        }

        const newExpense = db.Expense.build({ user_id: userUUID, amount, expense_date, category_id: categoryExists['id'], description, is_recurrent, start_date, end_date, receipt_id })
        return await newExpense.save().then(() => res.status(201).json(newExpense))
    } catch (err) {
        if (req.file) deleteReceiptOnFail(req.file.path)
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const updateExpense = async (req, res) => {
    try {
        const userUUID = req.user.id
        const { id } = req.params

        if (isUUID(id)) return res.status(400).json({ message: 'Invalid field', error: 'Invalid expense ID' })

        const currentExpense = await db.Expense.findOne({ where: { [Op.and]: { id: id, user_id: userUUID } } });
        if (!currentExpense) return res.status(404).json({ message: 'No match found' })

        if (currentExpense['is_recurring']) {
            if (!currentExpense['start_date']) {
                return res.status(400).json({ message: 'Invalid field', error: 'Reccuring expenses require a start date' })
            }
        }

        if (req.body.category_name) {
            const categoryExists = await db.Category.findOne({ where: { [Op.and]: { name: req.body.category_name, user_id: userUUID } } })
            if (!categoryExists) {
                return res.status(400).json({ message: 'Invalid field', error: 'Category does not exist' })
            }
            req.body.category_id = categoryExists['id']
            delete req.body.category_name
        }

        for (const field in currentExpense.toJSON()) {
            if (req.body[field] == '') req.body[field] = null
            if (field in req.body && req.body[field]) {
                currentExpense[field] = req.body[field]
            }
        }

        if (req.file) {
            const receipt_id = req.file.filename.split('.')[0]
            if (currentExpense['receipt_id']) await db.Receipt.destroy({ where: { [Op.and]: { id: currentExpense['receipt_id'], user_id: userUUID } } })
                .then(() => deleteReceiptOnFail(req.file.path))
                .catch((rej) => res.status(500).json({ message: 'Failed to delete receipt', error: rej }))
            db.Receipt.create({ id: receipt_id, file_path: req.file.path, user_id: userUUID })
            currentExpense['receipt_id'] = receipt_id
        }

        return await currentExpense.save()
            .then(() => res.status(200).json(currentExpense))
            .catch(err => res.status(500).json({ message: 'Failed to apply changes', error: err }))
    } catch (err) {
        return res.status(500).json({ message: 'Failed to update record', error: err.message })
    }
}

const deleteExpense = async (req, res) => {
    const userUUID = req.user.id
    try {
        const { id } = req.params;

        if (isUUID(id)) return res.status(400).json({ message: 'Invalid field', error: 'Invalid expense ID' })

        const deleteExpense = await db.Expense.findOne({ where: { [Op.and]: { id: id, user_id: userUUID } } })
        if (!deleteExpense) { return res.status(404).json({ message: 'No expense with such ID' }) }

        if (deleteExpense['receipt_id']) await db.Receipt.findOne({ where: { [Op.and]: { id: deleteExpense['receipt_id'], user_id: userUUID } } })
            .then((res) => deleteReceiptOnFail(res['file_path']))
            .then(() => db.Receipt.destroy({ where: { [Op.and]: { id: deleteExpense['receipt_id'], user_id: userUUID } } }))
            .catch((rej) => res.status(500).json({ message: 'Failed to delete receipt', error: rej }))

        return await deleteExpense.destroy()
            .then(() => res.status(204).json({ message: 'Deletion successful' }))
            .catch((rej) => res.status(500).json({ message: 'Failed to delete expense', error: rej }))
    } catch (err) {
        return res.status(500).json({ message: 'Failed to delete the record', error: err.message })
    }
}

export { getAllExpenses, getSpecificExpense, createExpense, updateExpense, deleteExpense }