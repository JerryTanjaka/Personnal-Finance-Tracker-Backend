const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');
const User = require('./User');
const Category = require('./Category');

export const Expense = sequelize.define('Expense', {
  expense_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  amount: { type: DataTypes.DECIMAL, allowNull: false },
  expense_date: { type: DataTypes.DATEONLY, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'one-time' },
  description: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'expense', timestamps: false });

Expense.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Expense, { foreignKey: 'user_id' });

Expense.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Expense, { foreignKey: 'category_id' });

