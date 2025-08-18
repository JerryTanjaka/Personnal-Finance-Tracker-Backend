/** @format */
import fs from "fs";
import path from "path";
import process from "process";
import Sequelize from "sequelize";
import { fileURLToPath } from "url";

// Recréation de __filename et __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// basename du fichier actuel (index.js)
const basename = path.basename(__filename);

// Choix de l'environnement (par défaut : development)
const env = process.env.NODE_ENV || "development";

// Import du fichier config.json
import configFile from "../config/config.js";
const config = configFile[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Lecture des modèles du dossier courant
const files = fs.readdirSync(__dirname).filter(file => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js" && !file.endsWith(".test.js"));

// Import dynamique des modèles
for (const file of files) {
	const module = await import(path.join(__dirname, file));
	const modelDefiner = module.default; // correspond au `export default` de chaque modèle
	const model = modelDefiner(sequelize, Sequelize.DataTypes);
	db[model.name] = model;

console.log(db);

}

// Associations si définies dans les modèles
for (const modelName of Object.keys(db)) {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
