import { Op } from "sequelize";
import db from "../models/index.js";

export const getReceiptByID = async (req, res) => {
    const userUUID = req.user?.id
    const { idExpense } = req.params
    try {
        if (!idExpense) {
            return res.status(404).json({ message: "No ID specified" })
        } else if (typeof idExpense != 'string' || idExpense.replaceAll('-', '').length !== 32) {
            return res.status(400).json({ message: 'Invalid expense ID', error: 'ID must be valid UUID' })
        }

        return await db.Expense.findOne({
            where: {
                [Op.and]: {
                    id: idExpense,
                    user_id: userUUID
                }
            }
        })
            .catch(rej => res.status(404).json({ message: "No expense with such ID" }))
            .then(async resolve => await db.Receipt.findOne({ where: { id: resolve['receipt_id'] } }))
            .catch(rej => res.status(404).json({ message: "No receipt found" }))
            .then(resolve => resolve['file_path'])
            .then(resolve => res.status(200).download(resolve))
            .catch(rej => res.status(500).json({ message: "Failed to download the file" }))

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }

}