import { sequelize, models } from './models/index.js';

const testCRUD = async () => {
  try {
    // Créer un utilisateur
    const user = await models.User.create({
      email: 'test@example.com',
      password: '1234'
    });
    console.log('Utilisateur créé :', user.toJSON());

    // Créer une catégorie
    const category = await models.Category.create({
      name: 'Food',
      is_default: true
    });

    // Créer une dépense
    const expense = await models.Expense.create({
      amount: 12.5,
      expense_date: '2025-08-15',
      type: 'one-time',
      description: 'Déjeuner',
      user_id: user.id,
      category_id: category.category_id
    });
    console.log('Dépense créée :', expense.toJSON());

    // Lister toutes les dépenses de l’utilisateur
    const expenses = await models.Expense.findAll({
      where: { user_id: user.id },
      include: [{ model: models.User }, { model: models.Category }]
    });
    console.log('Dépenses de l’utilisateur :', expenses.map(e => e.toJSON()));

  } catch (err) {
    console.error('Erreur CRUD :', err);
  } finally {
    await sequelize.close();
  }
};

await testCRUD();
