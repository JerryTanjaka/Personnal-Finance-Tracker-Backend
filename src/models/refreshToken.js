import { DataTypes, Model } from 'sequelize';

class RefreshToken extends Model {}

export default (sequelize) => {
  RefreshToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING(512),
        allowNull: false,
        unique: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      revoked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'refresh_tokens',
      modelName: 'RefreshToken',
    }
  );

  return RefreshToken;
};