/** @format */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Sequelize from "sequelize";
import process from "process";

// Recréation de __filename et __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// basename du fichier actuel (index.js)
const basename = path.basename(__filename);


// Choix de l'environnement (par défaut : development)
const env = process.env.NODE_ENV || "development";

// Import du fichier config.json
import configFile from "../config/config.json" assert { type: "json" };
const config = configFile[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Lecture des modèles du dossier courant
const files = fs
	.readdirSync(__dirname)
	.filter(
		(file) =>
			file.indexOf(".") !== 0 &&
			file !== basename &&
			file.slice(-3) === ".js" &&
			!file.endsWith(".test.js")
	);

for (const file of files) {
	// Import dynamique
	const { default: modelDefiner } = await import(path.join(__dirname, file));
	const model = modelDefiner(sequelize, Sequelize.DataTypes);
	db[model.name] = model;
}

// Associations si définies
for (const modelName of Object.keys(db)) {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
