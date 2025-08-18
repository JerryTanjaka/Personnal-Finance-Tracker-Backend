import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
  async checkPassword(plain) {
    return bcrypt.compare(plain, this.password);
  }
}

export default (sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('NOW()'),
      },
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const saltRounds = 10;
            user.password = await bcrypt.hash(user.password, saltRounds);
          }
        },
      },
      timestamps: false,
      underscored: true,
    }
  );

  return User;
};
