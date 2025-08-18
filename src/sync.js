/** @format */
import 'dotenv/config';
import pkg from 'pg';
import db from './models/index.js';
const { sequelize } = db;
import configFile from './config/config.js';
import dotenv from "dotenv";
dotenv.config(); 

const { Client } = pkg;
const env = process.env.NODE_ENV ;
const config = configFile[env];

const createDatabaseIfNotExists = async () => {
  const client = new Client({
    host: config.host,
    port: config.port || 5432,
    user: config.username,
    password: config.password,
    database: 'postgres', // base par défaut pour créer d'autres DB
  });

  try {
    await client.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname='${config.database}'`
    );
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${config.database}"`);
      console.log(`Base '${config.database}' créée !`);
    } else {
      console.log(`Base '${config.database}' existe déjà.`);
    }
  } catch (err) {
    console.error('Erreur création base :', err);
  } finally {
    await client.end();
  }
};

const syncDatabase = async () => {
  try {
    await createDatabaseIfNotExists();
    await sequelize.sync({ alter: true });
    console.log('Toutes les tables ont été créées !');
  } catch (error) {
    console.error('Erreur de synchronisation :', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
};

await syncDatabase();
