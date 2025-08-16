import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'users', timestamps: false });

  User.associate = (models) => {
    User.hasMany(models.Income, { foreignKey: 'user_id' });
    User.hasMany(models.Expense, { foreignKey: 'user_id' });
  };

  return User;
}
