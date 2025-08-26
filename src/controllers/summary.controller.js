/** @format */

import { Op } from "sequelize";
import db from "../models/index.js";
const Income = db.Income;
const Expense = db.Expense;
const Sequelize = db.Sequelize;
const getMonthlySummary = async (req, res) => {
	try {
		const { month } = req.query;

		if (!month) {
			return res.status(400).json({ message: "Month is required" });
		}
		const [yearNum, monthNum] = month.split("-").map(Number);
		const startDate = new Date(yearNum, monthNum - 1, 1);
		const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59);
		const totalIncome = await Income.sum("amount", {
			where: { income_date: { [Op.between]: [startDate, endDate] } },
		});

		const totalExpense = await Expense.sum("amount", {
			where: { date: { [Op.between]: [startDate, endDate] } },
		});

		res.status(200).json({
			month: monthNum,
			year: yearNum,
			totalIncome: totalIncome || 0,
			totalExpense: totalExpense || 0,
			netSavings: (totalIncome || 0) - (totalExpense || 0),
		});
	} catch (error) {
		console.error("Error fetching monthly summary:", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

const getSummary = async (req, res) => {
	try {
		const { month, year } = req.query;
		const startDate = req.params.startDate;
		const endDate = req.params.endDate;
		if (!month || !year) {
			return res.status(400).json({ message: "Month and year are required" });
		}

		const totalIncome = await Income.sum("amount", {
			where: {
				date: {
					[Op.between]: [startDate, endDate],
				},
			},
		});
		const totalExpense = await Expense.sum("amount", {
			where: {
				date: {
					[Op.between]: [startDate, endDate],
				},
			},
		});
		res.status(200).json({
			month,
			year,
			totalIncome: totalIncome || 0,
			totalExpense: totalExpense || 0,
			netSavings: (totalIncome || 0) - (totalExpense || 0),
		});
	} catch (error) {
		console.error("Error fetching monthly summary:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
export { getMonthlySummary, getSummary };
