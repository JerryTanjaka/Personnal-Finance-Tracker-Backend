import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Expense = sequelize.define('Expense', {
    expense_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
    expense_date: { type: DataTypes.DATEONLY, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'one-time' },
    description: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'expense', timestamps: false });

  Expense.associate = function(models) {
    Expense.belongsTo(models.User, { foreignKey: 'user_id' });
    Expense.belongsTo(models.Category, { foreignKey: 'category_id' });
  };

  return Expense;
}
