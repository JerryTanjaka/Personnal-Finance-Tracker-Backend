import { Op } from "sequelize";
import sequelize from "../config/db.js";
import db from "../models/index.js";
import { deleteReceipt } from "../middleware/uploadReceipt.js";

export const getProfileInfo = async (req, res) => {
    const userUUID = req.user?.id

    const userInfo = await db.User.findOne({ where: { id: userUUID }, attributes: { exclude: ['password', 'id'] } }).catch(rej => res.status(500).json({ message: "Failed to fetch user info", error: rej }))
    return res.status(200).json(userInfo)
}

// Delete all user data but keep the user account (emails/password). This removes incomes,
// expenses, receipts (files + rows), categories created by the user and refresh tokens.
export const deleteUserData = async (req, res) => {
    const userUUID = req.user?.id
    if (!userUUID) return res.status(401).json({ message: 'Unauthorized' })

    // gather receipt file paths first so we can remove files from disk
    try {
        const receipts = await db.Receipt.findAll({ where: { user_id: userUUID }, attributes: ['file_path'] })
        // attempt to delete each file, but don't fail the whole operation if a file is missing
        for (const r of receipts) {
            if (r && r.file_path) {
                try {
                    // deleteReceipt uses fs.rm internally
                    await deleteReceipt(r.file_path)
                } catch (err) {
                    // log and continue
                    console.error('Failed to delete receipt file', r.file_path, err)
                }
            }
        }

        // Perform DB deletions in a transaction
        await db.sequelize.transaction(async (t) => {
            await db.Expense.destroy({ where: { user_id: userUUID }, transaction: t })
            await db.Income.destroy({ where: { user_id: userUUID }, transaction: t })
            await db.Receipt.destroy({ where: { user_id: userUUID }, transaction: t })
            await db.Category.destroy({ where: { user_id: userUUID }, transaction: t })
        })

        return res.status(200).json({ message: 'User data deleted successfully' })
    } catch (err) {
        console.error('Failed to purge user data', err)
        return res.status(500).json({ message: 'Failed to delete user data', error: err.message })
    }
}

export async function deleteUserAccount(req, res) {
    const userUUID = req.user?.id
    if (!userUUID) return res.status(401).json({ message: 'Unauthorized' })

    await db.User.destroy({ where: { id: userUUID } })
        .then(() => res.status(200).json({ message: "User deleted successfully" }))
        .catch(rej => res.status(500).json({ message: "Server error", error: rej.message }))
    return;
}