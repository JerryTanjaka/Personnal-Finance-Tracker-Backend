import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
  async checkPassword(plain) {
    return bcrypt.compare(plain, this.passwordHash);
  }
}

export default (sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
      hooks: {
        // supporte creation via { password: '...' }
        beforeValidate: async (user) => {
          if (user.password && !user.passwordHash) {
            const saltRounds = 10;
            user.passwordHash = await bcrypt.hash(user.password, saltRounds);
          }
        },
      },
    }
  );

  return User;
};