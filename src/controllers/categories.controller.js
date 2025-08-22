import { Op } from "sequelize";
import db from "../models/index.js";

const getAllCategories = async (req, res) => {
    const userUUID = req.body.id
    try {
        await db.Category.findAll({ where: { [Op.or]: { user_id: userUUID, is_default: true } } })
            .then(resolve => res.status(200).json(resolve))
            .catch(rej => res.status(500).json({ message: 'Failed to list category', err: rej }))
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const createCategory = async (req, res) => {
    const userUUID = req.body.id
    try {
        const { categoryName } = req.body
        if (!categoryName) { return res.status(400).json({ message: 'Invalid field', error: 'No category name specified' }) }

        const categoryList = await db.Category.findAll({ where: { [Op.and]: { user_id: userUUID, name: { [Op.iLike]: categoryName } } } })
        if (categoryList) { return res.status(400).json({ message: 'Invalid field', error: 'Category already exists' }) }

        await db.Category.create({ name: categoryName, is_default: false, user_id: userUUID })
            .then(resolve => res.status(201).json(resolve))
            .catch(rej => res.status(500).json({ message: 'Failed to create category', err: rej }))
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const updateCategory = async (req, res) => {
    const userUUID = req.body.id
    try {
        const { id } = req.params
        if (!id) { return res.status(400).json({ message: 'Invalid field', error: 'No category ID specified' }) }

        const { name } = req.body
        if (!name) { return res.status(400).json({ message: 'Invalid field', error: 'No name specified' }) }

        const wantedCategory = await db.Category.findOne({ where: { [Op.and]: { user_id: userUUID, id: id } } })
        if (!wantedCategory) { return res.status(404).json({ message: 'No category with such ID' }) }

        await wantedCategory.update({ name: name })
            .then(resolve => res.status(200).json(resolve))
            .catch(rej => res.status(500).json({ message: 'Failed to update category', err: rej }))
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}

const deleteCategory = async (req, res) => {
    const userUUID = req.body.id
    try {
        const { id } = req.params
        const { force } = req.query
        if (!id) { return res.status(400).json({ message: 'Invalid field', error: 'No category ID specified' }) }

        const wantedCategory = await db.Category.findOne({ where: { [Op.and]: { user_id: userUUID, id: id } } })
        if (!wantedCategory) { return res.status(404).json({ message: 'No category with such ID' }) }

        const categoryExpenseList = db.Expense.findOne({ where: { [Op.and]: { user_id: userUUID, category_id: id } } })
        if (categoryExpenseList && !force) { return res.status(400).json({ message: 'Cannot delete', error: 'Category is still used' }) }

        await wantedCategory.destroy()
            .then(() => res.status(204).json({ message: 'Deleted category successfully' }))
            .catch(rej => res.status(500).json({ message: 'Failed to delete category', err: rej }))
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
}

export { getAllCategories, createCategory, updateCategory, deleteCategory }