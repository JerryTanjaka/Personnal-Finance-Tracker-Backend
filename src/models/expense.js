/** @format */

import { DataTypes, Model } from "sequelize";

class Expense extends Model {}

export default sequelize => {
	Expense.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: sequelize.literal("gen_random_uuid()"),
				primaryKey: true,
			},
			amount: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			is_recurrent: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			start_date: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			end_date: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: "expenses",
			modelName: "Expense",
			timestamps: false,
		},
	);

	return Expense;
};
