import sequelize from '../config/db.js';
import userFactory from './user.js';
import refreshTokenFactory from './refreshToken.js';
import expenseFactory from './expense.js'
import categoryFactory from './category.js';
import receiptFactory from './receipt.js';
import createMocks from '../data/mocks.js';
import incomeFactory from './income.js';

const db = {};

db.sequelize = sequelize;

db.User = userFactory(sequelize);
db.RefreshToken = refreshTokenFactory(sequelize);
db.Expense = expenseFactory(sequelize);
db.Category = categoryFactory(sequelize)
db.Receipt = receiptFactory(sequelize);
db.Income = incomeFactory(sequelize);

// Associations
db.User.hasMany(db.RefreshToken, { foreignKey: 'user_id', as: 'refresh_tokens' });
db.RefreshToken.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });

db.User.hasMany(db.Income, { foreignKey: 'user_id', as: 'incomes' });
db.Income.belongsTo(db.User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE' });


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


// Category associations
db.User.hasMany(db.Category, {
    foreignKey: { name: 'user_id', allowNull: true },
    sourceKey: 'id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

// Receipt associations
db.Receipt.belongsTo(db.User, { foreignKey: {name:'user_id', allowNull: false}, targetKey: 'id', as: 'user_fk', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
db.Receipt.hasOne(db.Expense, { foreignKey: {name:'receipt_id', allowNull: true}, sourceKey: 'id', as: 'receipt_fk', onDelete: 'SET NULL', onUpdate: 'CASCADE' })


// await sequelize.sync({ alter: true })

export default db;

// createMocks()