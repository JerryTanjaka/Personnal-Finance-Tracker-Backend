import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Expense = sequelize.define('Expense', {
    expense_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
    expense_date: { type: DataTypes.DATEONLY, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'one-time' }, // 'one-time' | 'recurring'
    description: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'expense', timestamps: false });

  Expense.associate = (models) => {
    Expense.belongsTo(models.User, { foreignKey: 'user_id' });
    Expense.belongsTo(models.Category, { foreignKey: 'category_id' });

    // 1–1 avec ExpenseRecurrence (si type === 'recurring')
    Expense.hasOne(models.ExpenseRecurrence, {
      foreignKey: 'expense_id',
      as: 'recurrence',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Expense;
};
