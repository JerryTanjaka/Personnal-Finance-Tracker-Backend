import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Expense extends Model { };

export default (sequelize) => {
    Expense.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            expense_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            type: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: sequelize.literal('NOW()'),
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id'}
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'categories', key: 'id'}
            }
        },
        {
            sequelize,
            tableName: 'expenses',
            modelName: 'Expense',
            timestamps: true,
        }
    );

    return Expense;
}