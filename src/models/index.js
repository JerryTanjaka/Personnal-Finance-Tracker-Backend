import sequelize from '../config/db.js';
import userFactory from './user.js';
import refreshTokenFactory from './refreshToken.js';
import incomeFactory from './income.js';

const db = {};

db.sequelize = sequelize;

db.User = userFactory(sequelize);
db.RefreshToken = refreshTokenFactory(sequelize);
db.Income = incomeFactory(sequelize);

// Associations
db.User.hasMany(db.RefreshToken, { foreignKey: 'user_id', as: 'refresh_tokens' });
db.RefreshToken.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });

db.User.hasMany(db.Income, { foreignKey: 'user_id', as: 'incomes' });
db.Income.belongsTo(db.User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });

export default db;
