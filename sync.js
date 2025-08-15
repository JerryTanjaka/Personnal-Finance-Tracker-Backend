import { sequelize } from './models/index.js';

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); 
    console.log(' Toutes les tables ont été créées !');
  } catch (error) {
    console.error(' Erreur de synchronisation:', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
};

await syncDatabase();
