import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
import userFactory from './user.js';
import refreshTokenFactory from './refreshToken.js';
import expenseFactory from './expense.js'
import categoryFactory from './category.js';

const db = {};

db.sequelize = sequelize;

db.User = userFactory(sequelize);
db.RefreshToken = refreshTokenFactory(sequelize);
db.Expense = expenseFactory(sequelize);
db.Category = categoryFactory(sequelize)

// Associations
// 1 User -> N RefreshTokens

db.User.hasMany(db.RefreshToken, { foreignKey: 'user_id', as: 'refresh_tokens' });
db.RefreshToken.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });


// Expenses assosiations
db.Expense.belongsTo(db.User, {
    foreignKey: 'user_id',
    targetKey: 'id',
    keyType: DataTypes.INTEGER,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
db.Expense.belongsTo(db.Category, {
    foreignKey: 'category_id',
    as: 'category_fk',
    targetKey: 'id',
    keyType: DataTypes.INTEGER,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});


// Category assiciations
db.User.hasMany(db.Category, {
    foreignKey: "user_id",
    sourceKey: 'id',
    keyType: DataTypes.INTEGER,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});



export default db;