import sequelize from '../config/db.js';
import userFactory from './user.js';
import refreshTokenFactory from './refreshToken.js';

const db = {};

db.sequelize = sequelize;

db.User = userFactory(sequelize);
db.RefreshToken = refreshTokenFactory(sequelize);

// Associations
// 1 User -> N RefreshTokens

db.User.hasMany(db.RefreshToken, { foreignKey: 'user_id', as: 'refresh_tokens' });
db.RefreshToken.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });

export default db;