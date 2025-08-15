/** @format */

import { Sequelize } from "sequelize";
import Category from "./Category.js";
import Expense from "./Expense.js";
import Income from "./Income.js";
import User from "./User.js";

const sequelize = new Sequelize("sequelizedb", "postgres", "king aff", {
	host: "localhost",
	dialect: "postgres",
	logging: false,
});

const models = {
	User: User(sequelize),
	Category: Category(sequelize),
	Expense: Expense(sequelize),
	Income: Income(sequelize),
};

// Création des associations
Object.values(models).forEach(model => {
	if (model.associate) {
		model.associate(models);
	}
});

export { models, sequelize };
