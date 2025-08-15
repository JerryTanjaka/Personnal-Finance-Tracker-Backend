import { DataTypes } from 'sequelize';

export default function(sequelize) {
  const Category = sequelize.define('Category', {
    category_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    is_default: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'category', timestamps: false });

  Category.associate = function(models) {
    Category.hasMany(models.Expense, { foreignKey: 'category_id' });
  };

  return Category;
}
