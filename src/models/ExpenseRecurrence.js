import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ExpenseRecurrence = sequelize.define('ExpenseRecurrence', {
    recurrence_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    expense_id: { type: DataTypes.INTEGER, allowNull: false, unique: true }, // une récurrence par dépense
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: true }, // null = “ongoing”
    // frequency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'monthly' },
  }, { tableName: 'expense_recurrence', timestamps: false });

  ExpenseRecurrence.associate = (models) => {
    ExpenseRecurrence.belongsTo(models.Expense, {
      foreignKey: 'expense_id',
      as: 'expense',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return ExpenseRecurrence;
};
