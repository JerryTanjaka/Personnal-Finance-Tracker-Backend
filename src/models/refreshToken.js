import { DataTypes, Model } from 'sequelize';

class RefreshToken extends Model {}

export default (sequelize) => {
  RefreshToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',        
        references: { model: 'users', key: 'id' },
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
      timestamps: true,          
    }
  );

  return RefreshToken;
};
