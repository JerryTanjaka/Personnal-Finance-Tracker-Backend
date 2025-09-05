import { Op } from "sequelize";
import sequelize from "../config/db.js";
import db from "../models/index.js";

export const getProfileInfo = async (req, res) => {
    const userUUID = req.user?.id

    const userInfo = await db.User.findOne({ where: { id: userUUID }, attributes: { exclude: ['password', 'id'] } }).catch(rej => res.status(500).json({ message: "Failed to fetch user info", error: rej }))
    return res.status(200).json({ userInfo })
}