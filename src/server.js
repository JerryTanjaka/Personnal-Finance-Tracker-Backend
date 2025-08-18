// server.js (ou index.js)
import express from "express";
import dotenv from "dotenv";
import db from "./models/index.js"; // Sequelize + modèles

dotenv.config();
// Importer vos fichiers de routes
import userRoutes from "./routes/user.route.js";
import expenseRoutes from "./routes/expense.route.js";


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/expenses", expenseRoutes);

// Route de test
app.get("/", (req, res) => res.send("API is running"));

// Vérification de la connexion à la base
db.sequelize.authenticate()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Unable to connect to DB:", err));

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
