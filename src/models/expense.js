import { DataTypes, Model } from "sequelize";

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
                defaultValue: sequelize.literal("NOW()"),
                allowNull: false
            }
        },
        {
            sequelize,
            tableName: 'expenses',
            modelName: 'Expense',
            timestamps: false,
        }
    );

    return Expense;
}