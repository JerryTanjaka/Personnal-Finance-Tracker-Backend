import { Op } from "sequelize";
import sequelize from "../config/db.js";
import db from "../models/index.js";

export const getProfileInfo = async (req, res) => {
    const userUUID = req.user?.id

    const userInfo = await db.User.findOne({ where: { id: userUUID } }).catch(rej => res.status(500).json({ message: "Failed to fetch user info", error: rej }))
    const expenseInfo = await db.Expense.findAll({
        where: { user_id: userUUID },
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'expenseCount'],
            [sequelize.fn('SUM', sequelize.col('amount')), 'expenseAmount'],
        ]
    }).catch(rej => res.status(500).json({ message: "Failed to fetch expense info", error: rej }))
    const cateogryInfo = await db.Category.findAll({
        where: { [Op.and]: { user_id: userUUID, is_default: false } },
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'customCategory'],
        ]
    }).catch(rej => res.status(500).json({ message: "Failed to fetch expense info", error: rej }))

    return res.status(200).json({ userInfo, expenseInfo, cateogryInfo })
}