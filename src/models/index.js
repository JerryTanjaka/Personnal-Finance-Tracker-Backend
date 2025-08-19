import sequelize from '../config/db.js';
import userFactory from './user.js';
import refreshTokenFactory from './refreshToken.js';
import expenseFactory from './expense.js'
import categoryFactory from './category.js';
import createMocks from '../data/mocks.js';

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
    foreignKey: { name: 'user_id', allowNull: false },
    as: 'user_fk',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
db.Expense.belongsTo(db.Category, {
    foreignKey: { name: 'category_id', allowNull: true },
    as: 'category_fk',
    targetKey: 'id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});


// Category assiciations
db.User.hasMany(db.Category, {
    foreignKey: { name: 'user_id', allowNull: true },
    sourceKey: 'id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

await sequelize.sync({ alter: true, force: true })

export default db;

createMocks()