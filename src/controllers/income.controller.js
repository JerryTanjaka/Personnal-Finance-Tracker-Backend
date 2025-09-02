/** @format */

import { Op } from "sequelize";
import db from "../models/index.js";
const Income = db.Income;

const handleNotFound = (res, message = "Income not found") => {
    return res.status(404).json({ message });
};

const handleError = (res, error, message = "An error occurred") => {
    console.error(message, error);
    return res.status(500).json({ message, error: error.message });
};

export const getIncomes = async (req, res) => {
    try {
        const { start, end } = req.query;
        const where = { user_id: req.user.id };

        if (start && end) {
            where.income_date = { [Op.between]: [start, end] };
        }

        const incomes = await Income.findAll({ where, order: [["income_date", "DESC"]] });
        res.json(incomes);
    } catch (error) {
        handleError(res, error, "Error fetching incomes");
    }
};

export const getIncomeById = async (req, res) => {
    try {
        const income = await Income.findOne({
            where: { id: req.params.id, user_id: req.user.id },
        });

        if (!income) return handleNotFound(res);
        res.json(income);
    } catch (error) {
        handleError(res, error, "Error fetching income");
    }
};

export const createIncome = async (req, res) => {
    try {
        const { amount, date, source, description } = req.body;

        const income = await Income.create({
            amount,
            income_date: date,
            source,
            description,
            user_id: req.user.id,
        });

        res.status(201).json(income);
    } catch (error) {
        handleError(res, error, "Error creating income");
    }
};

export const updateIncome = async (req, res) => {
    try {
        const { amount, date, source, description } = req.body;
        const [updatedRows] = await Income.update(
            { amount, income_date: date, source, description },
            {
                where: { id: req.params.id, user_id: req.user.id },
                returning: true,
            }
        );

        if (updatedRows === 0) {
            return handleNotFound(res);
        }

        const updatedIncome = await Income.findOne({ where: { id: req.params.id, user_id: req.user.id } });

        res.json(updatedIncome);
    } catch (error) {
        handleError(res, error, "Error updating income");
    }
};

export const deleteIncome = async (req, res) => {
    try {
        const deletedRows = await Income.destroy({
            where: { id: req.params.id, user_id: req.user.id },
        });

        if (deletedRows === 0) {
            return handleNotFound(res);
        }

        res.json({ message: "Income deleted successfully" });
    } catch (error) {
        handleError(res, error, "Error deleting income");
    }
};