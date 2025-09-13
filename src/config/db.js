/** @format */

import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

let sequelize;

if (process.env.DATABASE_URL) {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: "postgres",
		logging: false,
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	});
} else {
	sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: "postgres",
		logging: false,
	});
}

export default sequelize;
