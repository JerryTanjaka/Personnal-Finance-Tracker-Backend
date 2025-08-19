import { DataTypes, Model, UUIDV4 } from "sequelize";

class Expense extends Model { };

export default (sequelize) => {
    Expense.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: sequelize.literal('gen_random_uuid()'),
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
            is_recurrent: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            start_date: {
                type: DataTypes.DATE,
                allowNull: true
            },
            end_date: {
                type: DataTypes.DATE,
                allowNull: true
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