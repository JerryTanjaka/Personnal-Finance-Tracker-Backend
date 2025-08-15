import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Income = sequelize.define('Income', {
    income_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
    income_date: { type: DataTypes.DATEONLY, allowNull: false },
    source: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'income', timestamps: false });

  Income.associate = function(models) {
    Income.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Income;
}
