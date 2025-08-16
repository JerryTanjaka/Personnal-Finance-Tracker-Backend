/** @format */

import db from "./models/index.js";
const { sequelize } = db;

const syncDatabase = async () => {
	try {
		await sequelize.sync({ alter: true });
		console.log(" Toutes les tables ont été créées !");
	} catch (error) {
		console.error(" Erreur de synchronisation:", error);
	} finally {
		await sequelize.close();
		process.exit();
	}
};

await syncDatabase();
