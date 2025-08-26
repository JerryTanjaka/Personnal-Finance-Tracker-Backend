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

const getSummaryBetweenDates = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: "Start and end dates are required" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59); // fin de journée

    const totalIncome = await Income.sum("amount", {
      where: { income_date: { [Op.between]: [startDate, endDate] } },
    });

    const totalExpense = await Expense.sum("amount", {
      where: { date: { [Op.between]: [startDate, endDate] } },
    });

    res.status(200).json({
      start,
      end,
      totalIncome: totalIncome || 0,
      totalExpense: totalExpense || 0,
      netSavings: (totalIncome || 0) - (totalExpense || 0),
    });
  } catch (error) {
    console.error("Error fetching summary:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMonthlyAlerts = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const totalIncome = await Income.sum("amount", {
      where: { income_date: { [Op.between]: [startDate, endDate] } },
    });

    const totalExpense = await Expense.sum("amount", {
      where: { date: { [Op.between]: [startDate, endDate] } },
    });

    const net = (totalIncome || 0) - (totalExpense || 0);
    const alert = net < 0;

    res.status(200).json({
      alert,
      message: alert
        ? `You've exceeded your monthly budget by $${Math.abs(net).toFixed(2)}`
        : "You're within your budget this month",
    });
  } catch (error) {
    console.error("Error fetching monthly alerts:", error.message);
	res.status(500).json({ message: "Internal server error" });
  }
};
export { getMonthlySummary, getSummaryBetweenDates, getMonthlyAlerts };
